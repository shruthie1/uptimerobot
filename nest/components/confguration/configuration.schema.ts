import { Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ConfigurationDocument = Configuration & Document;

@Schema({versionKey: false, autoIndex: true,strict: false })
export class Configuration {}

export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);
ConfigurationSchema.add({ type: mongoose.Schema.Types.Mixed });

