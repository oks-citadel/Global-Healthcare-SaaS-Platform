# Performance Optimization Guide

## Table of Contents
- [Overview](#overview)
- [Caching Strategies](#caching-strategies)
- [Database Optimization](#database-optimization)
- [Frontend Performance](#frontend-performance)
- [API Performance](#api-performance)
- [Infrastructure Optimization](#infrastructure-optimization)
- [Monitoring and Metrics](#monitoring-and-metrics)
- [Best Practices](#best-practices)

## Overview

This guide provides comprehensive performance optimization strategies for the Unified Healthcare Platform. Following these practices will ensure optimal performance, scalability, and user experience.

### Performance Goals
- **API Response Time**: < 200ms (p95)
- **Page Load Time**: < 2s (initial load)
- **Time to Interactive**: < 3s
- **Database Query Time**: < 100ms (p95)
- **Cache Hit Rate**: > 80%

---

## Caching Strategies

### 1. Multi-Layer Caching Architecture

The platform implements a comprehensive caching strategy across multiple layers:

```
Browser Cache → CDN → Application Cache → Database Cache
```

### 2. Redis Caching Implementation

#### Cache-Aside Pattern (Lazy Loading)
Use for frequently accessed data that doesn't change often:

```typescript
import { getCache } from '@/lib/redis-cache';

async function getUserProfile(userId: string) {
  const cache = getCache();
  const cacheKey = `user:profile:${userId}`;

  // Try cache first
  return cache.cacheAside(
    cacheKey,
    async () => {
      // Load from database if not in cache
      return prisma.user.findUnique({ where: { id: userId } });
    },
    3600 // 1 hour TTL
  );
}
```

#### Write-Through Pattern
Use for critical data that must be consistent:

```typescript
async function updateUserProfile(userId: string, data: any) {
  const cache = getCache();
  const cacheKey = `user:profile:${userId}`;

  await cache.writeThrough(
    cacheKey,
    data,
    async (value) => {
      await prisma.user.update({
        where: { id: userId },
        data: value,
      });
    },
    3600
  );
}
```

#### Cache Warming
Pre-populate cache for frequently accessed data:

```typescript
import { getCache } from '@/lib/redis-cache';

async function warmCache() {
  const cache = getCache();

  await cache.warmCache({
    keys: ['popular:doctors', 'featured:services', 'active:appointments'],
    loader: async (key) => {
      // Load data based on key
      return loadDataForKey(key);
    },
    ttl: 3600,
  });
}
```

### 3. HTTP Caching Headers

#### Response Caching Middleware
```typescript
import { cacheMiddleware, staleWhileRevalidateMiddleware } from '@/middleware/cache.middleware';

// Public data with 5 minutes cache
app.get('/api/public/doctors',
  cacheMiddleware({ ttl: 300 }),
  doctorController.list
);

// Use stale-while-revalidate for better UX
app.get('/api/appointments',
  staleWhileRevalidateMiddleware(60, 300),
  appointmentController.list
);
```

#### ETags for Conditional Requests
ETags are automatically generated and handled by the cache middleware. Clients can use `If-None-Match` headers to receive 304 Not Modified responses.

### 4. Browser Caching

Configure caching headers in `next.config.js`:

```javascript
// Static assets - cache for 1 year
{
  source: '/static/:path*',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable',
    },
  ],
}

// API responses - use stale-while-revalidate
{
  source: '/api/:path*',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=60, stale-while-revalidate=300',
    },
  ],
}
```

### 5. Cache Invalidation Strategies

#### Time-Based Invalidation (TTL)
Set appropriate TTL based on data volatility:
- User profiles: 1 hour
- Static content: 24 hours
- Dynamic lists: 5 minutes
- Real-time data: 30 seconds

#### Event-Based Invalidation
Invalidate cache when data changes:

```typescript
async function createAppointment(data: any) {
  // Create appointment
  const appointment = await prisma.appointment.create({ data });

  // Invalidate related caches
  const cache = getCache();
  await cache.delete(`user:appointments:${data.userId}`);
  await cache.delete(`doctor:appointments:${data.doctorId}`);

  return appointment;
}
```

---

## Database Optimization

### 1. Query Optimization

#### Use Proper Indexing
```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);

-- Composite indexes for common query patterns
CREATE INDEX idx_appointments_user_date ON appointments(user_id, appointment_date);
```

#### Select Only Needed Fields
```typescript
import { QueryOptimization } from '@/lib/database-optimization';

// Bad: Select all fields
const users = await prisma.user.findMany();

// Good: Select only needed fields
const users = await prisma.user.findMany({
  select: QueryOptimization.selectFields(['id', 'name', 'email']),
});
```

#### Avoid N+1 Queries
```typescript
// Bad: N+1 query problem
const appointments = await prisma.appointment.findMany();
for (const appointment of appointments) {
  appointment.doctor = await prisma.doctor.findUnique({
    where: { id: appointment.doctorId },
  });
}

// Good: Use include or batch loading
const appointments = await prisma.appointment.findMany({
  include: {
    doctor: {
      select: { id: true, name: true, specialty: true },
    },
  },
});
```

### 2. Efficient Pagination

#### Cursor-Based Pagination for Large Datasets
```typescript
import { CursorPagination } from '@/utils/pagination';

async function getAppointments(cursor?: string) {
  const limit = 20;

  const appointments = await prisma.appointment.findMany({
    ...CursorPagination.getPrismaArgs(cursor, limit, 'id', 'desc'),
  });

  return CursorPagination.createResponse(appointments, limit, 'id');
}
```

#### Offset Pagination with Count Optimization
```typescript
import { OffsetPagination, CountOptimization } from '@/utils/pagination';

async function getUsers(page: number, limit: number) {
  // Get count with caching
  const total = await CountOptimization.getCachedCount(
    'users:total',
    () => prisma.user.count(),
    true
  );

  const users = await prisma.user.findMany(
    OffsetPagination.getPrismaArgs(page, limit, 'createdAt', 'desc')
  );

  return OffsetPagination.createResponse(users, total, page, limit);
}
```

### 3. Connection Pooling

Configure optimal connection pool settings:

```typescript
import { createOptimizedPrismaClient } from '@/lib/database-optimization';

const dbOptimization = createOptimizedPrismaClient({
  enableQueryLogging: true,
  slowQueryThreshold: 1000,
  connectionPoolSize: 10,
  connectionTimeout: 5000,
});
```

### 4. Read Replicas

Separate read and write operations:

```typescript
import { DatabaseOptimization } from '@/lib/database-optimization';

const dbOptimization = new DatabaseOptimization(
  primaryClient,
  { enableReadReplica: true },
  { url: process.env.DATABASE_REPLICA_URL }
);

// Use replica for read operations
const readClient = dbOptimization.getReadClient();
const users = await readClient.user.findMany();

// Use primary for writes
const writeClient = dbOptimization.getWriteClient();
await writeClient.user.create({ data });
```

### 5. Database Monitoring

Monitor slow queries and optimize:

```typescript
const dbOptimization = createOptimizedPrismaClient({
  enableQueryLogging: true,
  slowQueryThreshold: 1000, // 1 second
});

// Get slow queries
const slowQueries = dbOptimization.getSlowQueries();
console.log('Slow queries:', slowQueries);

// Get average query duration
const avgDuration = dbOptimization.getAverageQueryDuration();
console.log('Average query duration:', avgDuration);
```

---

## Frontend Performance

### 1. React Query Configuration

Optimize data fetching and caching:

```typescript
import { createQueryClient, queryKeys } from '@/lib/query-client';

const queryClient = createQueryClient();

// Prefetch data on hover
<Link
  href={`/appointments/${id}`}
  onMouseEnter={() => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.appointment.detail(id),
      queryFn: () => fetchAppointment(id),
    });
  }}
>
  View Appointment
</Link>
```

### 2. Code Splitting and Lazy Loading

```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const AppointmentCalendar = dynamic(
  () => import('@/components/AppointmentCalendar'),
  { loading: () => <LoadingSpinner /> }
);

// Lazy load with no SSR for client-only components
const PatientChart = dynamic(
  () => import('@/components/PatientChart'),
  { ssr: false }
);
```

### 3. Image Optimization

```typescript
import Image from 'next/image';

// Use Next.js Image component
<Image
  src="/doctor-profile.jpg"
  alt="Doctor Profile"
  width={300}
  height={300}
  placeholder="blur"
  blurDataURL="/placeholder.jpg"
  loading="lazy"
  quality={80}
/>
```

### 4. Virtual Scrolling for Large Lists

```typescript
import { VirtualList, InfiniteVirtualList } from '@/components/VirtualList';

// For large static lists
<VirtualList
  items={appointments}
  itemHeight={80}
  containerHeight={600}
  renderItem={({ item, index, style }) => (
    <AppointmentCard appointment={item} />
  )}
  keyExtractor={(item) => item.id}
/>

// For infinite scroll with pagination
<InfiniteVirtualList
  queryKey={queryKeys.appointment.lists()}
  fetchPage={fetchAppointments}
  itemHeight={80}
  containerHeight={600}
  renderItem={({ item }) => <AppointmentCard appointment={item} />}
  keyExtractor={(item) => item.id}
/>
```

### 5. Bundle Optimization

Analyze bundle size:

```bash
# Build with bundle analyzer
ANALYZE=true npm run build

# Review generated reports in .next/analyze/
```

Optimize imports:

```typescript
// Bad: Import entire library
import _ from 'lodash';

// Good: Import only needed functions
import debounce from 'lodash/debounce';

// Or use tree-shakeable libraries
import { debounce } from 'lodash-es';
```

---

## API Performance

### 1. Compression

Enable Gzip/Brotli compression:

```typescript
import { compressionMiddleware } from '@/middleware/compression.middleware';

app.use(compressionMiddleware({
  threshold: 1024, // 1KB minimum
  level: 6,
  preferBrotli: true,
}));
```

### 2. Response Optimization

#### Minimize Response Size
```typescript
// Return only necessary fields
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      // Exclude large fields like profilePicture
    },
  });

  res.json({ data: users });
});
```

#### Use Streaming for Large Responses
```typescript
app.get('/api/reports/export', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.write('[');

  const stream = await prisma.appointment.findManyStream();

  let first = true;
  for await (const appointment of stream) {
    if (!first) res.write(',');
    res.write(JSON.stringify(appointment));
    first = false;
  }

  res.write(']');
  res.end();
});
```

### 3. Rate Limiting

Protect API from abuse:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

app.use('/api/', limiter);
```

### 4. Async Operations

Use background jobs for heavy operations:

```typescript
// Instead of blocking response
app.post('/api/reports/generate', async (req, res) => {
  // Queue the job
  const jobId = await queueReportGeneration(req.body);

  // Return immediately
  res.json({
    message: 'Report generation started',
    jobId,
    statusUrl: `/api/jobs/${jobId}`,
  });
});
```

---

## Infrastructure Optimization

### 1. Kubernetes Resource Limits

Set appropriate resource limits in `resource-limits.yaml`:

```yaml
resources:
  requests:
    cpu: "500m"
    memory: "512Mi"
  limits:
    cpu: "1000m"
    memory: "1Gi"
```

### 2. Horizontal Pod Autoscaling

Configure HPA for automatic scaling:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### 3. CDN Configuration

Use CDN for static assets:

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['cdn.healthcare-platform.com'],
  },
  assetPrefix: process.env.CDN_URL,
};
```

### 4. Load Balancing

Distribute traffic across multiple instances:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  type: LoadBalancer
  selector:
    app: api
  ports:
  - port: 80
    targetPort: 8080
  sessionAffinity: ClientIP
```

---

## Monitoring and Metrics

### 1. Application Performance Monitoring (APM)

Track key metrics:

```typescript
import { logger } from '@/config/logger';

// Log performance metrics
const startTime = Date.now();
const result = await performOperation();
const duration = Date.now() - startTime;

logger.info('Operation completed', {
  operation: 'performOperation',
  duration,
  success: true,
});
```

### 2. Database Query Monitoring

```typescript
// Monitor slow queries
const dbOptimization = createOptimizedPrismaClient({
  enableQueryLogging: true,
  slowQueryThreshold: 1000,
});

// Review metrics periodically
setInterval(() => {
  const slowQueries = dbOptimization.getSlowQueries();
  if (slowQueries.length > 0) {
    logger.warn('Slow queries detected', { count: slowQueries.length });
  }
}, 60000); // Every minute
```

### 3. Cache Hit Rate Monitoring

```typescript
import { getCache } from '@/lib/redis-cache';

async function getCacheStats() {
  const cache = getCache();
  const stats = await cache.getStats();

  logger.info('Cache statistics', stats);
  return stats;
}
```

---

## Best Practices

### 1. General Performance Guidelines

- **Measure First**: Always measure performance before optimizing
- **Identify Bottlenecks**: Use profiling tools to find actual bottlenecks
- **Optimize Critical Path**: Focus on user-facing operations first
- **Test Performance**: Include performance tests in CI/CD pipeline
- **Monitor Production**: Continuously monitor production performance

### 2. Caching Guidelines

- Cache frequently accessed data
- Set appropriate TTLs based on data volatility
- Invalidate cache on data updates
- Monitor cache hit rates
- Use multi-layer caching strategy

### 3. Database Guidelines

- Index frequently queried columns
- Avoid SELECT * queries
- Use pagination for large datasets
- Implement connection pooling
- Monitor slow queries
- Use read replicas for read-heavy workloads

### 4. Frontend Guidelines

- Lazy load components and routes
- Optimize images (use Next.js Image)
- Implement virtual scrolling for large lists
- Minimize bundle size
- Use code splitting
- Prefetch critical resources

### 5. API Guidelines

- Enable compression
- Use efficient data formats (JSON over XML)
- Implement rate limiting
- Cache responses when possible
- Return only necessary data
- Use HTTP/2 or HTTP/3

### 6. Infrastructure Guidelines

- Set resource limits and requests
- Implement horizontal autoscaling
- Use CDN for static assets
- Enable load balancing
- Monitor resource utilization
- Implement health checks

---

## Performance Checklist

### Before Deployment

- [ ] Enable compression (Gzip/Brotli)
- [ ] Configure caching (Redis, HTTP headers)
- [ ] Optimize database queries (indexes, select fields)
- [ ] Implement pagination
- [ ] Set resource limits in Kubernetes
- [ ] Configure autoscaling (HPA)
- [ ] Enable CDN for static assets
- [ ] Optimize images
- [ ] Implement code splitting
- [ ] Set up monitoring and alerting

### Post-Deployment

- [ ] Monitor response times
- [ ] Track cache hit rates
- [ ] Review slow queries
- [ ] Monitor resource utilization
- [ ] Check error rates
- [ ] Analyze bundle sizes
- [ ] Review user experience metrics
- [ ] Conduct load testing
- [ ] Optimize based on real usage patterns

---

## Additional Resources

- [Next.js Performance Documentation](https://nextjs.org/docs/advanced-features/performance)
- [Prisma Performance Guide](https://www.prisma.io/docs/guides/performance-and-optimization)
- [React Query Performance](https://tanstack.com/query/latest/docs/react/guides/performance)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
- [Redis Best Practices](https://redis.io/docs/management/optimization/)

---

## Support

For performance-related issues or questions:
- Create an issue in the repository
- Contact the DevOps team
- Review monitoring dashboards
- Consult the performance metrics
