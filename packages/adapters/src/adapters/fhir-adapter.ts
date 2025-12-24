/**
 * FHIR R4 EHR Adapter
 * Generic adapter for FHIR R4 compliant healthcare systems
 */

import { BaseAdapter } from "../base-adapter";
import {
  AdapterConfig,
  AdapterRequest,
  AdapterResponse,
  AdapterContext,
  EhrOperations,
  PatientSearchQuery,
  EncounterSearchQuery,
  ObservationQuery,
} from "../types";

/**
 * FHIR R4 Adapter for EHR integrations
 * Supports Epic, Cerner, and other FHIR R4 compliant systems
 */
export class FhirR4Adapter extends BaseAdapter implements EhrOperations {
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: AdapterConfig) {
    super(config);
  }

  protected async executeRequest<T, R>(
    request: AdapterRequest<T>,
  ): Promise<AdapterResponse<R>> {
    const { operation, payload, context } = request;

    switch (operation) {
      case "getPatient":
        return this.getPatient(
          (payload as { patientId: string }).patientId,
          context,
        ) as Promise<AdapterResponse<R>>;
      case "searchPatients":
        return this.searchPatients(
          payload as PatientSearchQuery,
          context,
        ) as Promise<AdapterResponse<R>>;
      case "getEncounter":
        return this.getEncounter(
          (payload as { encounterId: string }).encounterId,
          context,
        ) as Promise<AdapterResponse<R>>;
      case "searchEncounters":
        return this.searchEncounters(
          payload as EncounterSearchQuery,
          context,
        ) as Promise<AdapterResponse<R>>;
      case "getObservations":
        return this.getObservations(
          (payload as { patientId: string }).patientId,
          payload as ObservationQuery,
          context,
        ) as Promise<AdapterResponse<R>>;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
  }

  protected async performHealthCheck(): Promise<void> {
    await this.ensureAuthenticated();
    const response = await this.fhirRequest("GET", "/metadata");
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
  }

  // ============================================================================
  // EHR OPERATIONS
  // ============================================================================

  async getPatient(
    patientId: string,
    context: AdapterContext,
  ): Promise<AdapterResponse> {
    const startTime = Date.now();
    await this.ensureAuthenticated();

    const response = await this.fhirRequest("GET", `/Patient/${patientId}`);
    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok ? this.transformPatient(data) : undefined,
      error: response.ok
        ? undefined
        : {
            code: `FHIR_${response.status}`,
            message: data.issue?.[0]?.diagnostics || "Failed to get patient",
            retryable: response.status >= 500,
          },
      metadata: {
        requestId: context.requestId,
        adapterId: this.id,
        durationMs: Date.now() - startTime,
        statusCode: response.status,
      },
    };
  }

  async searchPatients(
    query: PatientSearchQuery,
    context: AdapterContext,
  ): Promise<AdapterResponse> {
    const startTime = Date.now();
    await this.ensureAuthenticated();

    const params = new URLSearchParams();
    if (query.name) params.append("name", query.name);
    if (query.birthDate) params.append("birthdate", query.birthDate);
    if (query.identifier) params.append("identifier", query.identifier);
    if (query.phone) params.append("phone", query.phone);
    if (query.email) params.append("email", query.email);
    if (query.limit) params.append("_count", query.limit.toString());
    if (query.offset) params.append("_offset", query.offset.toString());

    const response = await this.fhirRequest(
      "GET",
      `/Patient?${params.toString()}`,
    );
    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok
        ? {
            patients: (data.entry || []).map((e: { resource: unknown }) =>
              this.transformPatient(e.resource),
            ),
            total: data.total || 0,
          }
        : undefined,
      error: response.ok
        ? undefined
        : {
            code: `FHIR_${response.status}`,
            message:
              data.issue?.[0]?.diagnostics || "Failed to search patients",
            retryable: response.status >= 500,
          },
      metadata: {
        requestId: context.requestId,
        adapterId: this.id,
        durationMs: Date.now() - startTime,
        statusCode: response.status,
      },
    };
  }

  async createPatient(
    patient: unknown,
    context: AdapterContext,
  ): Promise<AdapterResponse> {
    const startTime = Date.now();
    await this.ensureAuthenticated();

    const fhirPatient = this.toFhirPatient(patient);
    const response = await this.fhirRequest("POST", "/Patient", fhirPatient);
    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok ? this.transformPatient(data) : undefined,
      error: response.ok
        ? undefined
        : {
            code: `FHIR_${response.status}`,
            message: data.issue?.[0]?.diagnostics || "Failed to create patient",
            retryable: response.status >= 500,
          },
      metadata: {
        requestId: context.requestId,
        adapterId: this.id,
        durationMs: Date.now() - startTime,
        statusCode: response.status,
      },
    };
  }

  async updatePatient(
    patientId: string,
    patient: unknown,
    context: AdapterContext,
  ): Promise<AdapterResponse> {
    const startTime = Date.now();
    await this.ensureAuthenticated();

    const fhirPatient = this.toFhirPatient(patient);
    const response = await this.fhirRequest(
      "PUT",
      `/Patient/${patientId}`,
      fhirPatient,
    );
    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok ? this.transformPatient(data) : undefined,
      error: response.ok
        ? undefined
        : {
            code: `FHIR_${response.status}`,
            message: data.issue?.[0]?.diagnostics || "Failed to update patient",
            retryable: response.status >= 500,
          },
      metadata: {
        requestId: context.requestId,
        adapterId: this.id,
        durationMs: Date.now() - startTime,
        statusCode: response.status,
      },
    };
  }

  async getEncounter(
    encounterId: string,
    context: AdapterContext,
  ): Promise<AdapterResponse> {
    const startTime = Date.now();
    await this.ensureAuthenticated();

    const response = await this.fhirRequest("GET", `/Encounter/${encounterId}`);
    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok ? this.transformEncounter(data) : undefined,
      error: response.ok
        ? undefined
        : {
            code: `FHIR_${response.status}`,
            message: data.issue?.[0]?.diagnostics || "Failed to get encounter",
            retryable: response.status >= 500,
          },
      metadata: {
        requestId: context.requestId,
        adapterId: this.id,
        durationMs: Date.now() - startTime,
        statusCode: response.status,
      },
    };
  }

  async searchEncounters(
    query: EncounterSearchQuery,
    context: AdapterContext,
  ): Promise<AdapterResponse> {
    const startTime = Date.now();
    await this.ensureAuthenticated();

    const params = new URLSearchParams();
    if (query.patientId) params.append("patient", query.patientId);
    if (query.status) params.append("status", query.status);
    if (query.type) params.append("type", query.type);
    if (query.date) params.append("date", query.date);
    if (query.dateRange) {
      params.append("date", `ge${query.dateRange.start}`);
      params.append("date", `le${query.dateRange.end}`);
    }
    if (query.limit) params.append("_count", query.limit.toString());

    const response = await this.fhirRequest(
      "GET",
      `/Encounter?${params.toString()}`,
    );
    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok
        ? {
            encounters: (data.entry || []).map((e: { resource: unknown }) =>
              this.transformEncounter(e.resource),
            ),
            total: data.total || 0,
          }
        : undefined,
      error: response.ok
        ? undefined
        : {
            code: `FHIR_${response.status}`,
            message:
              data.issue?.[0]?.diagnostics || "Failed to search encounters",
            retryable: response.status >= 500,
          },
      metadata: {
        requestId: context.requestId,
        adapterId: this.id,
        durationMs: Date.now() - startTime,
        statusCode: response.status,
      },
    };
  }

  async getObservations(
    patientId: string,
    query: ObservationQuery,
    context: AdapterContext,
  ): Promise<AdapterResponse> {
    const startTime = Date.now();
    await this.ensureAuthenticated();

    const params = new URLSearchParams();
    params.append("patient", patientId);
    if (query.category) params.append("category", query.category);
    if (query.code) params.append("code", query.code);
    if (query.date) params.append("date", query.date);
    if (query.dateRange) {
      params.append("date", `ge${query.dateRange.start}`);
      params.append("date", `le${query.dateRange.end}`);
    }
    if (query.limit) params.append("_count", query.limit.toString());

    const response = await this.fhirRequest(
      "GET",
      `/Observation?${params.toString()}`,
    );
    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok
        ? {
            observations: (data.entry || []).map((e: { resource: unknown }) =>
              this.transformObservation(e.resource),
            ),
            total: data.total || 0,
          }
        : undefined,
      error: response.ok
        ? undefined
        : {
            code: `FHIR_${response.status}`,
            message:
              data.issue?.[0]?.diagnostics || "Failed to get observations",
            retryable: response.status >= 500,
          },
      metadata: {
        requestId: context.requestId,
        adapterId: this.id,
        durationMs: Date.now() - startTime,
        statusCode: response.status,
      },
    };
  }

  async getConditions(
    patientId: string,
    context: AdapterContext,
  ): Promise<AdapterResponse> {
    const startTime = Date.now();
    await this.ensureAuthenticated();

    const response = await this.fhirRequest(
      "GET",
      `/Condition?patient=${patientId}`,
    );
    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok
        ? {
            conditions: (data.entry || []).map((e: { resource: unknown }) =>
              this.transformCondition(e.resource),
            ),
            total: data.total || 0,
          }
        : undefined,
      metadata: {
        requestId: context.requestId,
        adapterId: this.id,
        durationMs: Date.now() - startTime,
        statusCode: response.status,
      },
    };
  }

  async getMedications(
    patientId: string,
    context: AdapterContext,
  ): Promise<AdapterResponse> {
    const startTime = Date.now();
    await this.ensureAuthenticated();

    const response = await this.fhirRequest(
      "GET",
      `/MedicationRequest?patient=${patientId}`,
    );
    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok
        ? {
            medications: (data.entry || []).map((e: { resource: unknown }) =>
              this.transformMedication(e.resource),
            ),
            total: data.total || 0,
          }
        : undefined,
      metadata: {
        requestId: context.requestId,
        adapterId: this.id,
        durationMs: Date.now() - startTime,
        statusCode: response.status,
      },
    };
  }

  async getAllergies(
    patientId: string,
    context: AdapterContext,
  ): Promise<AdapterResponse> {
    const startTime = Date.now();
    await this.ensureAuthenticated();

    const response = await this.fhirRequest(
      "GET",
      `/AllergyIntolerance?patient=${patientId}`,
    );
    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok
        ? {
            allergies: (data.entry || []).map((e: { resource: unknown }) =>
              this.transformAllergy(e.resource),
            ),
            total: data.total || 0,
          }
        : undefined,
      metadata: {
        requestId: context.requestId,
        adapterId: this.id,
        durationMs: Date.now() - startTime,
        statusCode: response.status,
      },
    };
  }

  async getDocuments(
    patientId: string,
    context: AdapterContext,
  ): Promise<AdapterResponse> {
    const startTime = Date.now();
    await this.ensureAuthenticated();

    const response = await this.fhirRequest(
      "GET",
      `/DocumentReference?patient=${patientId}`,
    );
    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok
        ? {
            documents: (data.entry || []).map((e: { resource: unknown }) =>
              this.transformDocument(e.resource),
            ),
            total: data.total || 0,
          }
        : undefined,
      metadata: {
        requestId: context.requestId,
        adapterId: this.id,
        durationMs: Date.now() - startTime,
        statusCode: response.status,
      },
    };
  }

  async getDocument(
    documentId: string,
    context: AdapterContext,
  ): Promise<AdapterResponse> {
    const startTime = Date.now();
    await this.ensureAuthenticated();

    const response = await this.fhirRequest(
      "GET",
      `/DocumentReference/${documentId}`,
    );
    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok ? this.transformDocument(data) : undefined,
      metadata: {
        requestId: context.requestId,
        adapterId: this.id,
        durationMs: Date.now() - startTime,
        statusCode: response.status,
      },
    };
  }

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================

  private async ensureAuthenticated(): Promise<void> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return;
    }
    await this.authenticate();
  }

  private async authenticate(): Promise<void> {
    // Implementation depends on auth method in config
    // For SMART on FHIR, this would use OAuth2
    // For basic auth, this would set up headers
    // Placeholder for now - actual implementation would fetch from Key Vault
    this.accessToken = "placeholder-token";
    this.tokenExpiry = new Date(Date.now() + 3600000); // 1 hour
  }

  // ============================================================================
  // HTTP HELPERS
  // ============================================================================

  private async fhirRequest(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<Response> {
    const headers: Record<string, string> = {
      Accept: "application/fhir+json",
      "Content-Type": "application/fhir+json",
      ...this.config.headers,
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const url = `${this.config.baseUrl}${path}`;
    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  }

  // ============================================================================
  // TRANSFORMERS
  // ============================================================================

  private transformPatient(fhirPatient: Record<string, unknown>): unknown {
    const name = (fhirPatient.name as Array<Record<string, unknown>>)?.[0];
    return {
      id: fhirPatient.id,
      identifiers: fhirPatient.identifier,
      firstName: (name?.given as string[])?.[0],
      lastName: name?.family,
      birthDate: fhirPatient.birthDate,
      gender: fhirPatient.gender,
      address: fhirPatient.address,
      phone: this.extractTelecom(fhirPatient, "phone"),
      email: this.extractTelecom(fhirPatient, "email"),
      active: fhirPatient.active,
    };
  }

  private transformEncounter(fhirEncounter: Record<string, unknown>): unknown {
    return {
      id: fhirEncounter.id,
      status: fhirEncounter.status,
      class: fhirEncounter.class,
      type: fhirEncounter.type,
      subject: fhirEncounter.subject,
      period: fhirEncounter.period,
      participant: fhirEncounter.participant,
      location: fhirEncounter.location,
      reasonCode: fhirEncounter.reasonCode,
    };
  }

  private transformObservation(
    fhirObservation: Record<string, unknown>,
  ): unknown {
    return {
      id: fhirObservation.id,
      status: fhirObservation.status,
      category: fhirObservation.category,
      code: fhirObservation.code,
      subject: fhirObservation.subject,
      effectiveDateTime: fhirObservation.effectiveDateTime,
      value: fhirObservation.valueQuantity || fhirObservation.valueString,
      interpretation: fhirObservation.interpretation,
      referenceRange: fhirObservation.referenceRange,
    };
  }

  private transformCondition(fhirCondition: Record<string, unknown>): unknown {
    return {
      id: fhirCondition.id,
      clinicalStatus: fhirCondition.clinicalStatus,
      verificationStatus: fhirCondition.verificationStatus,
      code: fhirCondition.code,
      subject: fhirCondition.subject,
      onsetDateTime: fhirCondition.onsetDateTime,
      abatementDateTime: fhirCondition.abatementDateTime,
      recordedDate: fhirCondition.recordedDate,
    };
  }

  private transformMedication(
    fhirMedication: Record<string, unknown>,
  ): unknown {
    return {
      id: fhirMedication.id,
      status: fhirMedication.status,
      intent: fhirMedication.intent,
      medication: fhirMedication.medicationCodeableConcept,
      subject: fhirMedication.subject,
      authoredOn: fhirMedication.authoredOn,
      dosageInstruction: fhirMedication.dosageInstruction,
      dispenseRequest: fhirMedication.dispenseRequest,
    };
  }

  private transformAllergy(fhirAllergy: Record<string, unknown>): unknown {
    return {
      id: fhirAllergy.id,
      clinicalStatus: fhirAllergy.clinicalStatus,
      verificationStatus: fhirAllergy.verificationStatus,
      type: fhirAllergy.type,
      category: fhirAllergy.category,
      criticality: fhirAllergy.criticality,
      code: fhirAllergy.code,
      patient: fhirAllergy.patient,
      onsetDateTime: fhirAllergy.onsetDateTime,
      reaction: fhirAllergy.reaction,
    };
  }

  private transformDocument(fhirDocument: Record<string, unknown>): unknown {
    return {
      id: fhirDocument.id,
      status: fhirDocument.status,
      type: fhirDocument.type,
      category: fhirDocument.category,
      subject: fhirDocument.subject,
      date: fhirDocument.date,
      author: fhirDocument.author,
      description: fhirDocument.description,
      content: fhirDocument.content,
    };
  }

  private extractTelecom(
    resource: Record<string, unknown>,
    system: string,
  ): string | undefined {
    const telecoms = resource.telecom as Array<Record<string, string>>;
    return telecoms?.find((t) => t.system === system)?.value;
  }

  private toFhirPatient(_patient: unknown): unknown {
    // Convert internal patient format to FHIR Patient resource
    // Placeholder implementation
    return _patient;
  }
}
