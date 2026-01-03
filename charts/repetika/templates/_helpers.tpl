{{- define "repetika.name" -}}
repetika
{{- end -}}

{{- define "repetika.fullname" -}}
{{- printf "%s" .Release.Name -}}
{{- end -}}

{{- define "repetika.labels" -}}
app.kubernetes.io/name: {{ include "repetika.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
