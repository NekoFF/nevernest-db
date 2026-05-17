export function mapMedia(snapshot) {
  return {
    mediaAssets: (snapshot.data.media || []).map((item) => ({
      external_id: item.id,
      entity_type: item.entityType,
      entity_external_id: item.entityId,
      resolved_entity_external_id: item.resolvedEntityId || item.entityId,
      kind: item.kind,
      path: item.path,
      alt: item.alt || '',
      source_url: '',
      license_note: '',
      width: null,
      height: null,
      source_status: item.status === 'local-seed' ? 'unknown' : 'unknown',
      metadata: { originalStatus: item.status },
    })),
  }
}

