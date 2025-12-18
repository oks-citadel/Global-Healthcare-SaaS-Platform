#!/bin/bash

##############################################################################
# Database Performance Monitoring Script
#
# Features:
# - Query analysis and slow query detection
# - Index recommendations
# - Connection pool monitoring
# - Table bloat detection
# - Performance metrics collection
# - Lock monitoring
# - Disk space monitoring
# - Automated performance reports
##############################################################################

set -euo pipefail

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load environment variables
if [ -f "$SCRIPT_DIR/../../services/api/.env" ]; then
    source "$SCRIPT_DIR/../../services/api/.env"
fi

##############################################################################
# Configuration
##############################################################################

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-unified_health_dev}"
DB_USER="${DB_USER:-unified_health}"
DB_PASSWORD="${DB_PASSWORD:-password}"

OUTPUT_DIR="${OUTPUT_DIR:-$SCRIPT_DIR/../monitoring/database}"
SLOW_QUERY_THRESHOLD="${SLOW_QUERY_THRESHOLD:-1000}" # milliseconds
REPORT_FORMAT="${REPORT_FORMAT:-text}" # text, json, html

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_FILE="${OUTPUT_DIR}/reports/performance_report_${TIMESTAMP}.txt"

##############################################################################
# Logging Functions
##############################################################################

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

log_section() {
    echo ""
    echo "=========================================="
    echo "$1"
    echo "=========================================="
    echo ""
}

##############################################################################
# Setup Functions
##############################################################################

setup_directories() {
    mkdir -p "$OUTPUT_DIR"
    mkdir -p "$OUTPUT_DIR/reports"
    mkdir -p "$OUTPUT_DIR/queries"
    mkdir -p "$OUTPUT_DIR/metrics"
}

check_pg_stat_statements() {
    export PGPASSWORD="$DB_PASSWORD"

    local extension_exists=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --tuples-only \
        --command="SELECT COUNT(*) FROM pg_extension WHERE extname = 'pg_stat_statements';" \
        2>/dev/null)

    unset PGPASSWORD

    if [ "$extension_exists" -eq 0 ]; then
        log "WARNING: pg_stat_statements extension not installed"
        log "To enable query statistics, run: CREATE EXTENSION pg_stat_statements;"
        return 1
    fi

    return 0
}

##############################################################################
# Monitoring Functions
##############################################################################

check_connection_pool() {
    log_section "Connection Pool Status"

    export PGPASSWORD="$DB_PASSWORD"

    local output=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --command="
        SELECT
            state,
            COUNT(*) as count,
            ROUND(AVG(EXTRACT(EPOCH FROM (now() - state_change)))) as avg_duration_sec
        FROM pg_stat_activity
        WHERE datname = '$DB_NAME'
        GROUP BY state
        ORDER BY count DESC;
        " 2>/dev/null)

    echo "$output"
    echo ""

    # Total connections
    local total_connections=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --tuples-only \
        --command="SELECT COUNT(*) FROM pg_stat_activity WHERE datname = '$DB_NAME';" \
        2>/dev/null)

    echo "Total Connections: $total_connections"

    # Max connections
    local max_connections=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --tuples-only \
        --command="SHOW max_connections;" \
        2>/dev/null)

    echo "Max Connections: $max_connections"
    echo "Connection Usage: $(echo "scale=2; $total_connections * 100 / $max_connections" | bc)%"

    unset PGPASSWORD
}

analyze_slow_queries() {
    log_section "Slow Queries Analysis"

    if ! check_pg_stat_statements; then
        echo "Skipping slow query analysis - pg_stat_statements not available"
        return
    fi

    export PGPASSWORD="$DB_PASSWORD"

    local output=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --command="
        SELECT
            ROUND(mean_exec_time::numeric, 2) as avg_time_ms,
            ROUND(total_exec_time::numeric, 2) as total_time_ms,
            calls,
            ROUND((100 * total_exec_time / SUM(total_exec_time) OVER())::numeric, 2) as pct_total_time,
            LEFT(query, 100) as query_sample
        FROM pg_stat_statements
        WHERE mean_exec_time > $SLOW_QUERY_THRESHOLD
        ORDER BY mean_exec_time DESC
        LIMIT 20;
        " 2>/dev/null)

    echo "$output"

    unset PGPASSWORD
}

check_missing_indexes() {
    log_section "Missing Indexes Analysis"

    export PGPASSWORD="$DB_PASSWORD"

    local output=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --command="
        SELECT
            schemaname,
            tablename,
            ROUND((seq_scan::float / NULLIF(seq_scan + idx_scan, 0))::numeric, 4) as seq_scan_ratio,
            seq_scan,
            idx_scan,
            n_live_tup as rows
        FROM pg_stat_user_tables
        WHERE seq_scan > 0
            AND schemaname = 'public'
        ORDER BY seq_scan DESC
        LIMIT 20;
        " 2>/dev/null)

    echo "$output"
    echo ""
    echo "Tables with high sequential scan ratios may benefit from indexes"

    unset PGPASSWORD
}

check_unused_indexes() {
    log_section "Unused Indexes"

    export PGPASSWORD="$DB_PASSWORD"

    local output=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --command="
        SELECT
            schemaname,
            tablename,
            indexname,
            idx_scan,
            pg_size_pretty(pg_relation_size(indexrelid)) as index_size
        FROM pg_stat_user_indexes
        WHERE idx_scan = 0
            AND schemaname = 'public'
            AND indexrelname NOT LIKE '%pkey'
        ORDER BY pg_relation_size(indexrelid) DESC
        LIMIT 20;
        " 2>/dev/null)

    echo "$output"
    echo ""
    echo "Consider removing unused indexes to improve write performance"

    unset PGPASSWORD
}

check_table_bloat() {
    log_section "Table Bloat Analysis"

    export PGPASSWORD="$DB_PASSWORD"

    local output=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --command="
        SELECT
            schemaname,
            tablename,
            pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
            n_live_tup as live_rows,
            n_dead_tup as dead_rows,
            ROUND((n_dead_tup::float / NULLIF(n_live_tup + n_dead_tup, 0) * 100)::numeric, 2) as bloat_pct,
            last_vacuum,
            last_autovacuum
        FROM pg_stat_user_tables
        WHERE schemaname = 'public'
        ORDER BY n_dead_tup DESC
        LIMIT 20;
        " 2>/dev/null)

    echo "$output"
    echo ""
    echo "Tables with high bloat percentage may need VACUUM FULL"

    unset PGPASSWORD
}

check_lock_monitoring() {
    log_section "Lock Monitoring"

    export PGPASSWORD="$DB_PASSWORD"

    local output=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --command="
        SELECT
            locktype,
            mode,
            COUNT(*) as count
        FROM pg_locks
        WHERE database = (SELECT oid FROM pg_database WHERE datname = '$DB_NAME')
        GROUP BY locktype, mode
        ORDER BY count DESC;
        " 2>/dev/null)

    echo "$output"

    # Check for blocking queries
    echo ""
    echo "Blocking Queries:"
    echo ""

    local blocking=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --command="
        SELECT
            blocked.pid AS blocked_pid,
            blocked.usename AS blocked_user,
            blocking.pid AS blocking_pid,
            blocking.usename AS blocking_user,
            blocked.query AS blocked_query
        FROM pg_catalog.pg_locks blocked
        JOIN pg_catalog.pg_stat_activity blocked_act ON blocked.pid = blocked_act.pid
        JOIN pg_catalog.pg_locks blocking ON blocking.locktype = blocked.locktype
            AND blocking.database IS NOT DISTINCT FROM blocked.database
            AND blocking.relation IS NOT DISTINCT FROM blocked.relation
            AND blocking.page IS NOT DISTINCT FROM blocked.page
            AND blocking.tuple IS NOT DISTINCT FROM blocked.tuple
            AND blocking.virtualxid IS NOT DISTINCT FROM blocked.virtualxid
            AND blocking.transactionid IS NOT DISTINCT FROM blocked.transactionid
            AND blocking.classid IS NOT DISTINCT FROM blocked.classid
            AND blocking.objid IS NOT DISTINCT FROM blocked.objid
            AND blocking.objsubid IS NOT DISTINCT FROM blocked.objsubid
            AND blocking.pid != blocked.pid
        JOIN pg_catalog.pg_stat_activity blocking_act ON blocking.pid = blocking_act.pid
        WHERE NOT blocked.granted;
        " 2>/dev/null)

    if [ -z "$blocking" ]; then
        echo "No blocking queries detected"
    else
        echo "$blocking"
    fi

    unset PGPASSWORD
}

check_database_size() {
    log_section "Database Size"

    export PGPASSWORD="$DB_PASSWORD"

    local output=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --command="
        SELECT
            pg_size_pretty(pg_database_size('$DB_NAME')) as database_size;
        " 2>/dev/null)

    echo "$output"
    echo ""

    # Table sizes
    echo "Largest Tables:"
    echo ""

    local tables=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --command="
        SELECT
            schemaname,
            tablename,
            pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
            pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
            pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size
        FROM pg_tables
        WHERE schemaname = 'public'
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
        LIMIT 10;
        " 2>/dev/null)

    echo "$tables"

    unset PGPASSWORD
}

check_cache_hit_ratio() {
    log_section "Cache Hit Ratio"

    export PGPASSWORD="$DB_PASSWORD"

    local output=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --command="
        SELECT
            'Cache Hit Ratio' as metric,
            ROUND((sum(blks_hit) * 100.0 / NULLIF(sum(blks_hit) + sum(blks_read), 0))::numeric, 2) as percentage
        FROM pg_stat_database
        WHERE datname = '$DB_NAME';
        " 2>/dev/null)

    echo "$output"
    echo ""
    echo "Target: > 99% (if lower, consider increasing shared_buffers)"

    unset PGPASSWORD
}

check_transaction_stats() {
    log_section "Transaction Statistics"

    export PGPASSWORD="$DB_PASSWORD"

    local output=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --command="
        SELECT
            xact_commit as commits,
            xact_rollback as rollbacks,
            ROUND((xact_rollback::float / NULLIF(xact_commit + xact_rollback, 0) * 100)::numeric, 2) as rollback_pct,
            tup_returned as rows_returned,
            tup_fetched as rows_fetched,
            tup_inserted as rows_inserted,
            tup_updated as rows_updated,
            tup_deleted as rows_deleted
        FROM pg_stat_database
        WHERE datname = '$DB_NAME';
        " 2>/dev/null)

    echo "$output"

    unset PGPASSWORD
}

check_replication_lag() {
    log_section "Replication Status"

    export PGPASSWORD="$DB_PASSWORD"

    local is_replica=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --tuples-only \
        --command="SELECT pg_is_in_recovery();" \
        2>/dev/null)

    if [ "$is_replica" = "t" ]; then
        echo "This is a replica database"
        echo ""

        local lag=$(psql \
            --host="$DB_HOST" \
            --port="$DB_PORT" \
            --username="$DB_USER" \
            --dbname="$DB_NAME" \
            --command="
            SELECT
                EXTRACT(EPOCH FROM (now() - pg_last_xact_replay_timestamp())) as lag_seconds;
            " 2>/dev/null)

        echo "$lag"
    else
        echo "This is a primary database"
        echo ""

        local replication_slots=$(psql \
            --host="$DB_HOST" \
            --port="$DB_PORT" \
            --username="$DB_USER" \
            --dbname="$DB_NAME" \
            --command="
            SELECT
                slot_name,
                active,
                pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) as lag
            FROM pg_replication_slots;
            " 2>/dev/null)

        if [ -z "$replication_slots" ]; then
            echo "No replication slots configured"
        else
            echo "Replication Slots:"
            echo "$replication_slots"
        fi
    fi

    unset PGPASSWORD
}

generate_performance_recommendations() {
    log_section "Performance Recommendations"

    export PGPASSWORD="$DB_PASSWORD"

    echo "Based on the analysis above, here are some recommendations:"
    echo ""

    # Check for tables without primary keys
    local tables_without_pk=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --tuples-only \
        --command="
        SELECT COUNT(*)
        FROM information_schema.tables t
        LEFT JOIN information_schema.table_constraints tc
            ON t.table_name = tc.table_name
            AND tc.constraint_type = 'PRIMARY KEY'
        WHERE t.table_schema = 'public'
            AND tc.constraint_name IS NULL;
        " 2>/dev/null)

    if [ "$tables_without_pk" -gt 0 ]; then
        echo "- $tables_without_pk tables without primary keys detected"
        echo "  Action: Add primary keys to improve query performance"
        echo ""
    fi

    # Check autovacuum settings
    local autovacuum=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --tuples-only \
        --command="SHOW autovacuum;" \
        2>/dev/null)

    echo "- Autovacuum is: $autovacuum"
    if [ "$autovacuum" = "off" ]; then
        echo "  WARNING: Enable autovacuum for better performance"
    fi
    echo ""

    # Check work_mem
    local work_mem=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --tuples-only \
        --command="SHOW work_mem;" \
        2>/dev/null)

    echo "- work_mem setting: $work_mem"
    echo "  Consider tuning based on query complexity and available RAM"
    echo ""

    # Check shared_buffers
    local shared_buffers=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --tuples-only \
        --command="SHOW shared_buffers;" \
        2>/dev/null)

    echo "- shared_buffers setting: $shared_buffers"
    echo "  Recommended: 25% of available RAM for dedicated database server"
    echo ""

    unset PGPASSWORD
}

export_metrics_prometheus() {
    local metrics_file="${OUTPUT_DIR}/metrics/metrics_${TIMESTAMP}.prom"

    export PGPASSWORD="$DB_PASSWORD"

    # Get metrics
    local total_connections=$(psql --host="$DB_HOST" --port="$DB_PORT" --username="$DB_USER" --dbname="$DB_NAME" --tuples-only --command="SELECT COUNT(*) FROM pg_stat_activity WHERE datname = '$DB_NAME';" 2>/dev/null)
    local db_size=$(psql --host="$DB_HOST" --port="$DB_PORT" --username="$DB_USER" --dbname="$DB_NAME" --tuples-only --command="SELECT pg_database_size('$DB_NAME');" 2>/dev/null)
    local cache_hit_ratio=$(psql --host="$DB_HOST" --port="$DB_PORT" --username="$DB_USER" --dbname="$DB_NAME" --tuples-only --command="SELECT ROUND((sum(blks_hit) * 100.0 / NULLIF(sum(blks_hit) + sum(blks_read), 0))::numeric, 2) FROM pg_stat_database WHERE datname = '$DB_NAME';" 2>/dev/null)

    unset PGPASSWORD

    cat > "$metrics_file" <<EOF
# HELP pg_connections Total database connections
# TYPE pg_connections gauge
pg_connections{database="$DB_NAME"} $total_connections

# HELP pg_database_size Database size in bytes
# TYPE pg_database_size gauge
pg_database_size{database="$DB_NAME"} $db_size

# HELP pg_cache_hit_ratio Cache hit ratio percentage
# TYPE pg_cache_hit_ratio gauge
pg_cache_hit_ratio{database="$DB_NAME"} $cache_hit_ratio
EOF

    log "Metrics exported to: $metrics_file"
}

##############################################################################
# Main Execution
##############################################################################

main() {
    log_section "Database Performance Monitoring Report"
    log "Database: $DB_NAME@$DB_HOST:$DB_PORT"
    log "Timestamp: $(date)"

    setup_directories

    # Run all checks
    check_connection_pool | tee -a "$REPORT_FILE"
    analyze_slow_queries | tee -a "$REPORT_FILE"
    check_missing_indexes | tee -a "$REPORT_FILE"
    check_unused_indexes | tee -a "$REPORT_FILE"
    check_table_bloat | tee -a "$REPORT_FILE"
    check_lock_monitoring | tee -a "$REPORT_FILE"
    check_database_size | tee -a "$REPORT_FILE"
    check_cache_hit_ratio | tee -a "$REPORT_FILE"
    check_transaction_stats | tee -a "$REPORT_FILE"
    check_replication_lag | tee -a "$REPORT_FILE"
    generate_performance_recommendations | tee -a "$REPORT_FILE"

    # Export Prometheus metrics
    export_metrics_prometheus

    log_section "Report Summary"
    log "Full report saved to: $REPORT_FILE"
    log "Metrics exported for Prometheus integration"
}

# Run main function
main "$@"
