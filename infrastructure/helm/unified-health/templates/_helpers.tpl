{{/*
Expand the name of the chart.
*/}}
{{- define "unified-health.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "unified-health.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "unified-health.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "unified-health.labels" -}}
helm.sh/chart: {{ include "unified-health.chart" . }}
{{ include "unified-health.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
environment: {{ .Values.global.environment }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "unified-health.selectorLabels" -}}
app.kubernetes.io/name: {{ include "unified-health.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
API labels
*/}}
{{- define "unified-health.api.labels" -}}
{{ include "unified-health.labels" . }}
app: unified-health-api
component: backend
{{- end }}

{{/*
Web labels
*/}}
{{- define "unified-health.web.labels" -}}
{{ include "unified-health.labels" . }}
app: unified-health-web
component: frontend
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "unified-health.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "unified-health.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Image pull secrets
*/}}
{{- define "unified-health.imagePullSecrets" -}}
{{- if .Values.global.imagePullSecrets }}
imagePullSecrets:
{{- range .Values.global.imagePullSecrets }}
  - name: {{ .name }}
{{- end }}
{{- end }}
{{- end }}

{{/*
API image
*/}}
{{- define "unified-health.api.image" -}}
{{- $registry := .Values.global.imageRegistry }}
{{- $repository := .Values.image.api.repository }}
{{- $tag := .Values.image.api.tag | default .Chart.AppVersion }}
{{- printf "%s/%s:%s" $registry $repository $tag }}
{{- end }}

{{/*
Web image
*/}}
{{- define "unified-health.web.image" -}}
{{- $registry := .Values.global.imageRegistry }}
{{- $repository := .Values.image.web.repository }}
{{- $tag := .Values.image.web.tag | default .Chart.AppVersion }}
{{- printf "%s/%s:%s" $registry $repository $tag }}
{{- end }}
