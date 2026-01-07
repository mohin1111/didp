import { useState, useCallback, useEffect } from 'react';
import type { TableRelationship, ValueMapping } from '../types';
import {
  relationshipsApi,
  valueMappingsApi,
  type TableRelationshipResponse,
  type ValueMappingResponse,
} from '../api';

// Convert backend relationship to frontend type
function toFrontendRelationship(backend: TableRelationshipResponse): TableRelationship {
  return {
    id: String(backend.id),
    name: backend.name || undefined,
    sourceTable: backend.source_table_key,
    sourceColumn: backend.source_column,
    targetTable: backend.target_table_key,
    targetColumn: backend.target_column,
    type: backend.relationship_type as TableRelationship['type'],
  };
}

// Convert backend value mapping to frontend type
function toFrontendValueMapping(backend: ValueMappingResponse): ValueMapping {
  return {
    id: String(backend.id),
    name: backend.name,
    description: backend.description || undefined,
    mappings: backend.mappings,
  };
}

export function useRelationships() {
  const [relationships, setRelationships] = useState<TableRelationship[]>([]);
  const [valueMappings, setValueMappings] = useState<ValueMapping[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [showValueMappingModal, setShowValueMappingModal] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<TableRelationship | null>(null);
  const [editingValueMapping, setEditingValueMapping] = useState<ValueMapping | null>(null);

  // Load relationships from backend
  const loadRelationships = useCallback(async () => {
    try {
      const data = await relationshipsApi.list();
      setRelationships(data.map(toFrontendRelationship));
    } catch (error) {
      console.error('Error loading relationships:', error);
    }
  }, []);

  // Load value mappings from backend
  const loadValueMappings = useCallback(async () => {
    try {
      const data = await valueMappingsApi.list();
      setValueMappings(data.map(toFrontendValueMapping));
    } catch (error) {
      console.error('Error loading value mappings:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    Promise.all([loadRelationships(), loadValueMappings()])
      .finally(() => setIsLoading(false));
  }, [loadRelationships, loadValueMappings]);

  // Add a new relationship via backend
  const addRelationship = useCallback(async (relationship: Omit<TableRelationship, 'id'>): Promise<TableRelationship> => {
    try {
      const backendRel = await relationshipsApi.create({
        name: relationship.name,
        source_table_key: relationship.sourceTable,
        source_column: relationship.sourceColumn,
        target_table_key: relationship.targetTable,
        target_column: relationship.targetColumn,
        relationship_type: relationship.type,
      });

      const newRelationship = toFrontendRelationship(backendRel);
      setRelationships(prev => [...prev, newRelationship]);
      return newRelationship;
    } catch (error) {
      console.error('Error creating relationship:', error);
      throw error;
    }
  }, []);

  // Update an existing relationship via backend
  const updateRelationship = useCallback(async (id: string, updates: Partial<TableRelationship>) => {
    try {
      const relId = parseInt(id, 10);
      const updateData: Parameters<typeof relationshipsApi.update>[1] = {};

      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.sourceColumn) updateData.source_column = updates.sourceColumn;
      if (updates.targetColumn) updateData.target_column = updates.targetColumn;
      if (updates.type) updateData.relationship_type = updates.type;

      const backendRel = await relationshipsApi.update(relId, updateData);
      const updatedRelationship = toFrontendRelationship(backendRel);

      setRelationships(prev =>
        prev.map(rel => rel.id === id ? updatedRelationship : rel)
      );
    } catch (error) {
      console.error('Error updating relationship:', error);
      throw error;
    }
  }, []);

  // Delete a relationship via backend
  const deleteRelationship = useCallback(async (id: string) => {
    try {
      const relId = parseInt(id, 10);
      await relationshipsApi.delete(relId);
      setRelationships(prev => prev.filter(rel => rel.id !== id));
    } catch (error) {
      console.error('Error deleting relationship:', error);
      throw error;
    }
  }, []);

  // Get relationships for a specific table
  const getRelationshipsForTable = useCallback((tableKey: string) => {
    return relationships.filter(
      rel => rel.sourceTable === tableKey || rel.targetTable === tableKey
    );
  }, [relationships]);

  // Add a new value mapping via backend
  const addValueMapping = useCallback(async (mapping: Omit<ValueMapping, 'id'>): Promise<ValueMapping> => {
    try {
      const backendMapping = await valueMappingsApi.create({
        name: mapping.name,
        description: mapping.description,
        mappings: mapping.mappings,
      });

      const newMapping = toFrontendValueMapping(backendMapping);
      setValueMappings(prev => [...prev, newMapping]);
      return newMapping;
    } catch (error) {
      console.error('Error creating value mapping:', error);
      throw error;
    }
  }, []);

  // Update a value mapping via backend
  const updateValueMapping = useCallback(async (id: string, updates: Partial<ValueMapping>) => {
    try {
      const mappingId = parseInt(id, 10);
      const updateData: Parameters<typeof valueMappingsApi.update>[1] = {};

      if (updates.name) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.mappings) updateData.mappings = updates.mappings;

      const backendMapping = await valueMappingsApi.update(mappingId, updateData);
      const updatedMapping = toFrontendValueMapping(backendMapping);

      setValueMappings(prev =>
        prev.map(mapping => mapping.id === id ? updatedMapping : mapping)
      );
    } catch (error) {
      console.error('Error updating value mapping:', error);
      throw error;
    }
  }, []);

  // Delete a value mapping via backend
  const deleteValueMapping = useCallback(async (id: string) => {
    try {
      const mappingId = parseInt(id, 10);
      await valueMappingsApi.delete(mappingId);
      setValueMappings(prev => prev.filter(mapping => mapping.id !== id));
    } catch (error) {
      console.error('Error deleting value mapping:', error);
      throw error;
    }
  }, []);

  // Apply value mapping to transform a value (local lookup, backend call if needed)
  const applyValueMapping = useCallback((mappingId: string, value: string): string => {
    const mapping = valueMappings.find(m => m.id === mappingId);
    if (!mapping) return value;
    return mapping.mappings[value] ?? value;
  }, [valueMappings]);

  // Reverse lookup in value mapping
  const reverseValueMapping = useCallback((mappingId: string, transformedValue: string): string => {
    const mapping = valueMappings.find(m => m.id === mappingId);
    if (!mapping) return transformedValue;
    const entry = Object.entries(mapping.mappings).find(([, v]) => v === transformedValue);
    return entry ? entry[0] : transformedValue;
  }, [valueMappings]);

  // Open modal to edit relationship
  const openEditRelationship = useCallback((relationship: TableRelationship) => {
    setEditingRelationship(relationship);
    setShowRelationshipModal(true);
  }, []);

  // Open modal to create new relationship
  const openNewRelationship = useCallback(() => {
    setEditingRelationship(null);
    setShowRelationshipModal(true);
  }, []);

  // Open modal to edit value mapping
  const openEditValueMapping = useCallback((mapping: ValueMapping) => {
    setEditingValueMapping(mapping);
    setShowValueMappingModal(true);
  }, []);

  // Open modal to create new value mapping
  const openNewValueMapping = useCallback(() => {
    setEditingValueMapping(null);
    setShowValueMappingModal(true);
  }, []);

  return {
    relationships,
    setRelationships,
    valueMappings,
    setValueMappings,
    isLoading,
    showRelationshipModal,
    setShowRelationshipModal,
    showValueMappingModal,
    setShowValueMappingModal,
    editingRelationship,
    setEditingRelationship,
    editingValueMapping,
    setEditingValueMapping,
    addRelationship,
    updateRelationship,
    deleteRelationship,
    getRelationshipsForTable,
    addValueMapping,
    updateValueMapping,
    deleteValueMapping,
    applyValueMapping,
    reverseValueMapping,
    openEditRelationship,
    openNewRelationship,
    openEditValueMapping,
    openNewValueMapping,
    loadRelationships,
    loadValueMappings,
  };
}
