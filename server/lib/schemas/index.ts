import { z } from 'zod';

export const ScenarioSchema = z.object({
  type: z.string().min(1, "Type is required"),
  params: z.record(z.string(), z.any()).default({}),
});

export const ExecutionRequestSchema = z.object({
  decisionId: z.string().uuid("Invalid decision ID format"),
  baseVersion: z.number().int().nonnegative("Base version must be a non-negative integer"),
  simulatedState: z.any(),
  scenario: ScenarioSchema.optional(),
  strategy: z.string().optional(),
});

export const RollbackRequestSchema = z.object({
  decisionId: z.string().uuid("Invalid decision ID format"),
});

export const RailwayEventSchema = z.object({
  id: z.string().uuid("Invalid event ID format"),
  timestamp: z.number().int().positive(),
  type: z.enum([
    "train_position",
    "train_delay",
    "platform_change",
    "crowd_change",
    "weather_change",
    "incident"
  ]),
  entityId: z.string().min(1),
  payload: z.record(z.string(), z.any())
});
