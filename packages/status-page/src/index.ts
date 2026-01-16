/**
 * Unified Health Status Page Integration
 *
 * Integrates with StatusPage.io (Atlassian) or similar services
 * to provide public status updates and incident communication.
 */

import axios, { AxiosInstance } from "axios";
import { z } from "zod";

// ============================================================================
// Types & Schemas
// ============================================================================

export const ComponentStatusSchema = z.enum([
  "operational",
  "degraded_performance",
  "partial_outage",
  "major_outage",
  "under_maintenance",
]);
export type ComponentStatus = z.infer<typeof ComponentStatusSchema>;

export const IncidentStatusSchema = z.enum([
  "investigating",
  "identified",
  "monitoring",
  "resolved",
  "scheduled",
  "in_progress",
  "verifying",
  "completed",
]);
export type IncidentStatus = z.infer<typeof IncidentStatusSchema>;

export const IncidentImpactSchema = z.enum([
  "none",
  "minor",
  "major",
  "critical",
]);
export type IncidentImpact = z.infer<typeof IncidentImpactSchema>;

export interface Component {
  id: string;
  name: string;
  description?: string;
  status: ComponentStatus;
  position: number;
  groupId?: string;
  onlyShowIfDegraded?: boolean;
}

export interface Incident {
  id: string;
  name: string;
  status: IncidentStatus;
  impact: IncidentImpact;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  shortlink: string;
  components: string[];
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  id: string;
  status: IncidentStatus;
  body: string;
  createdAt: string;
  displayAt?: string;
}

export interface MaintenanceWindow {
  id: string;
  name: string;
  status: "scheduled" | "in_progress" | "completed";
  impact: IncidentImpact;
  scheduledFor: string;
  scheduledUntil: string;
  components: string[];
}

// ============================================================================
// Status Page Client
// ============================================================================

export interface StatusPageConfig {
  apiKey: string;
  pageId: string;
  baseUrl?: string;
}

export class StatusPageClient {
  private client: AxiosInstance;
  private pageId: string;

  constructor(config: StatusPageConfig) {
    this.pageId = config.pageId;
    this.client = axios.create({
      baseURL: config.baseUrl || "https://api.statuspage.io/v1",
      headers: {
        Authorization: `OAuth ${config.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  // ============================================================================
  // Components
  // ============================================================================

  /**
   * Get all components
   */
  async getComponents(): Promise<Component[]> {
    const response = await this.client.get(`/pages/${this.pageId}/components`);
    return response.data;
  }

  /**
   * Update component status
   */
  async updateComponentStatus(
    componentId: string,
    status: ComponentStatus,
  ): Promise<Component> {
    const response = await this.client.patch(
      `/pages/${this.pageId}/components/${componentId}`,
      { component: { status } },
    );
    return response.data;
  }

  /**
   * Batch update component statuses
   */
  async updateMultipleComponents(
    updates: Array<{ id: string; status: ComponentStatus }>,
  ): Promise<Component[]> {
    const promises = updates.map(({ id, status }) =>
      this.updateComponentStatus(id, status),
    );
    return Promise.all(promises);
  }

  // ============================================================================
  // Incidents
  // ============================================================================

  /**
   * Get active incidents
   */
  async getActiveIncidents(): Promise<Incident[]> {
    const response = await this.client.get(
      `/pages/${this.pageId}/incidents/unresolved`,
    );
    return response.data;
  }

  /**
   * Get all incidents
   */
  async getIncidents(options?: {
    limit?: number;
    page?: number;
  }): Promise<Incident[]> {
    const response = await this.client.get(`/pages/${this.pageId}/incidents`, {
      params: options,
    });
    return response.data;
  }

  /**
   * Create a new incident
   */
  async createIncident(incident: {
    name: string;
    status: IncidentStatus;
    impact: IncidentImpact;
    body: string;
    componentIds?: string[];
    componentStatus?: ComponentStatus;
  }): Promise<Incident> {
    const response = await this.client.post(`/pages/${this.pageId}/incidents`, {
      incident: {
        name: incident.name,
        status: incident.status,
        impact_override: incident.impact,
        body: incident.body,
        component_ids: incident.componentIds,
        components: incident.componentIds?.reduce(
          (acc, id) => {
            acc[id] = incident.componentStatus || "degraded_performance";
            return acc;
          },
          {} as Record<string, string>,
        ),
      },
    });
    return response.data;
  }

  /**
   * Update an existing incident
   */
  async updateIncident(
    incidentId: string,
    update: {
      status?: IncidentStatus;
      body?: string;
      componentStatus?: ComponentStatus;
    },
  ): Promise<Incident> {
    const response = await this.client.patch(
      `/pages/${this.pageId}/incidents/${incidentId}`,
      {
        incident: {
          status: update.status,
          body: update.body,
        },
      },
    );
    return response.data;
  }

  /**
   * Resolve an incident
   */
  async resolveIncident(
    incidentId: string,
    message: string,
  ): Promise<Incident> {
    return this.updateIncident(incidentId, {
      status: "resolved",
      body: message,
    });
  }

  // ============================================================================
  // Maintenance
  // ============================================================================

  /**
   * Get scheduled maintenances
   */
  async getScheduledMaintenances(): Promise<MaintenanceWindow[]> {
    const response = await this.client.get(
      `/pages/${this.pageId}/incidents?q=scheduled`,
    );
    return response.data;
  }

  /**
   * Schedule maintenance
   */
  async scheduleMaintenance(maintenance: {
    name: string;
    body: string;
    scheduledFor: Date;
    scheduledUntil: Date;
    componentIds: string[];
  }): Promise<MaintenanceWindow> {
    const response = await this.client.post(`/pages/${this.pageId}/incidents`, {
      incident: {
        name: maintenance.name,
        status: "scheduled",
        body: maintenance.body,
        scheduled_for: maintenance.scheduledFor.toISOString(),
        scheduled_until: maintenance.scheduledUntil.toISOString(),
        component_ids: maintenance.componentIds,
        components: maintenance.componentIds.reduce(
          (acc, id) => {
            acc[id] = "under_maintenance";
            return acc;
          },
          {} as Record<string, string>,
        ),
      },
    });
    return response.data;
  }

  // ============================================================================
  // Metrics
  // ============================================================================

  /**
   * Submit a metric data point
   */
  async submitMetric(
    metricId: string,
    value: number,
    timestamp?: Date,
  ): Promise<void> {
    await this.client.post(`/pages/${this.pageId}/metrics/${metricId}/data`, {
      data: {
        timestamp: (timestamp || new Date()).getTime() / 1000,
        value,
      },
    });
  }
}

// ============================================================================
// Unified Health Integration
// ============================================================================

export const UNIFIED_HEALTH_COMPONENTS = {
  API_GATEWAY: "api-gateway",
  WEB_APPLICATION: "web-application",
  AUTHENTICATION: "authentication",
  APPOINTMENTS: "appointments",
  TELEHEALTH: "telehealth",
  BILLING: "billing",
  NOTIFICATIONS: "notifications",
  DATABASE: "database",
  CACHE: "cache",
} as const;

export type UnifiedHealthComponent =
  (typeof UNIFIED_HEALTH_COMPONENTS)[keyof typeof UNIFIED_HEALTH_COMPONENTS];

/**
 * Unified Health Status Manager
 *
 * High-level interface for managing platform status
 */
export class UnifiedHealthStatusManager {
  private client: StatusPageClient;
  private componentMapping: Map<string, string>;

  constructor(
    config: StatusPageConfig,
    componentMapping?: Record<string, string>,
  ) {
    this.client = new StatusPageClient(config);
    this.componentMapping = new Map(Object.entries(componentMapping || {}));
  }

  /**
   * Map internal component name to StatusPage component ID
   */
  private getComponentId(component: UnifiedHealthComponent): string {
    const id = this.componentMapping.get(component);
    if (!id) {
      throw new Error(`No StatusPage component ID mapped for: ${component}`);
    }
    return id;
  }

  /**
   * Report a service degradation
   */
  async reportDegradation(
    component: UnifiedHealthComponent,
    description: string,
  ): Promise<Incident> {
    const componentId = this.getComponentId(component);

    return this.client.createIncident({
      name: `${component} Performance Degradation`,
      status: "investigating",
      impact: "minor",
      body: description,
      componentIds: [componentId],
      componentStatus: "degraded_performance",
    });
  }

  /**
   * Report a service outage
   */
  async reportOutage(
    component: UnifiedHealthComponent,
    description: string,
    isMajor = false,
  ): Promise<Incident> {
    const componentId = this.getComponentId(component);

    return this.client.createIncident({
      name: `${component} ${isMajor ? "Major " : ""}Outage`,
      status: "investigating",
      impact: isMajor ? "critical" : "major",
      body: description,
      componentIds: [componentId],
      componentStatus: isMajor ? "major_outage" : "partial_outage",
    });
  }

  /**
   * Update incident status
   */
  async updateIncidentStatus(
    incidentId: string,
    status: IncidentStatus,
    message: string,
  ): Promise<Incident> {
    return this.client.updateIncident(incidentId, {
      status,
      body: message,
    });
  }

  /**
   * Mark incident as resolved
   */
  async resolveIncident(
    incidentId: string,
    message: string,
  ): Promise<Incident> {
    return this.client.resolveIncident(incidentId, message);
  }

  /**
   * Schedule maintenance window
   */
  async scheduleMaintenance(options: {
    name: string;
    description: string;
    startTime: Date;
    endTime: Date;
    components: UnifiedHealthComponent[];
  }): Promise<MaintenanceWindow> {
    const componentIds = options.components.map((c) => this.getComponentId(c));

    return this.client.scheduleMaintenance({
      name: options.name,
      body: options.description,
      scheduledFor: options.startTime,
      scheduledUntil: options.endTime,
      componentIds,
    });
  }

  /**
   * Set component operational (after recovery)
   */
  async setOperational(component: UnifiedHealthComponent): Promise<Component> {
    const componentId = this.getComponentId(component);
    return this.client.updateComponentStatus(componentId, "operational");
  }

  /**
   * Get current platform status
   */
  async getPlatformStatus(): Promise<{
    overall: ComponentStatus;
    components: Array<{ name: string; status: ComponentStatus }>;
    activeIncidents: number;
  }> {
    const [components, incidents] = await Promise.all([
      this.client.getComponents(),
      this.client.getActiveIncidents(),
    ]);

    // Determine overall status from component statuses (worst status wins)
    let overall: ComponentStatus = "operational";
    const statusPriority: Record<ComponentStatus, number> = {
      operational: 0,
      under_maintenance: 1,
      degraded_performance: 2,
      partial_outage: 3,
      major_outage: 4,
    };
    for (const component of components) {
      if (statusPriority[component.status] > statusPriority[overall]) {
        overall = component.status;
      }
    }

    return {
      overall,
      components: components.map((c) => ({ name: c.name, status: c.status })),
      activeIncidents: incidents.length,
    };
  }
}

// ============================================================================
// Incident Templates
// ============================================================================

export const INCIDENT_TEMPLATES = {
  INVESTIGATING: (component: string) =>
    `We are currently investigating issues with ${component}. Our team has been notified and is looking into the matter.`,

  IDENTIFIED: (component: string, cause: string) =>
    `We have identified the cause of the ${component} issues: ${cause}. Our team is working on a fix.`,

  MONITORING: (component: string) =>
    `A fix has been implemented for ${component}. We are monitoring the situation to ensure stability.`,

  RESOLVED: (component: string) =>
    `The issue with ${component} has been resolved. All systems are now operating normally. We apologize for any inconvenience.`,

  MAINTENANCE_SCHEDULED: (
    component: string,
    startTime: string,
    endTime: string,
  ) =>
    `Scheduled maintenance for ${component} will occur from ${startTime} to ${endTime}. During this time, the service may be temporarily unavailable.`,

  MAINTENANCE_IN_PROGRESS: (component: string) =>
    `Scheduled maintenance for ${component} is now in progress. The service may be temporarily unavailable.`,

  MAINTENANCE_COMPLETED: (component: string) =>
    `Scheduled maintenance for ${component} has been completed. All systems are now operating normally.`,
};

// ============================================================================
// Exports
// ============================================================================

export default StatusPageClient;
