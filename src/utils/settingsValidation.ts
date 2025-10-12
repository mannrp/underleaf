import { z } from 'zod';

// Theme configuration schema
const themeSchema = z.enum(['light', 'dark', 'monokai', 'solarized-dark', 'solarized-light', 'github-light', 'github-dark']);

// Editor settings schema
const editorSettingsSchema = z.object({
    lineNumbers: z.boolean().default(true),
    wordWrap: z.boolean().default(false),
    minimap: z.boolean().default(true),
    tabSize: z.number().min(1).max(8).default(2),
    insertSpaces: z.boolean().default(true),
    fontSize: z.number().min(8).max(72).default(14),
});

// PDF viewer settings schema
const pdfSettingsSchema = z.object({
    fitMode: z.enum(['width', 'height', 'actual']).default('width'),
    autoRefresh: z.boolean().default(true),
    zoom: z.number().min(0.1).max(5).default(1),
});

// File management settings schema
const fileSettingsSchema = z.object({
    autoSave: z.boolean().default(true),
    autoSaveInterval: z.number().min(1).max(300).default(30), // seconds
    sessionRestore: z.boolean().default(true),
    recentFilesLimit: z.number().min(1).max(50).default(10),
});

// Appearance settings schema
const appearanceSettingsSchema = z.object({
    theme: themeSchema.default('light'),
    customColors: z.object({
        primary: z.string().optional(),
        secondary: z.string().optional(),
        accent: z.string().optional(),
    }).optional(),
});

// Main settings schema
export const settingsSchema = z.object({
    editor: editorSettingsSchema,
    pdf: pdfSettingsSchema,
    files: fileSettingsSchema,
    appearance: appearanceSettingsSchema,
    version: z.string().default('1.0.0'),
});

export type Settings = z.infer<typeof settingsSchema>;
export type EditorSettings = z.infer<typeof editorSettingsSchema>;
export type PdfSettings = z.infer<typeof pdfSettingsSchema>;
export type FileSettings = z.infer<typeof fileSettingsSchema>;
export type AppearanceSettings = z.infer<typeof appearanceSettingsSchema>;
export type Theme = z.infer<typeof themeSchema>;

// Default settings
export const defaultSettings: Settings = {
    editor: {
        lineNumbers: true,
        wordWrap: false,
        minimap: true,
        tabSize: 2,
        insertSpaces: true,
        fontSize: 14,
    },
    pdf: {
        fitMode: 'width',
        autoRefresh: true,
        zoom: 1,
    },
    files: {
        autoSave: true,
        autoSaveInterval: 30,
        sessionRestore: true,
        recentFilesLimit: 10,
    },
    appearance: {
        theme: 'light',
    },
    version: '1.0.0',
};

// Validation functions
export function validateSettings(settings: unknown): Settings {
    try {
        return settingsSchema.parse(settings);
    } catch (error) {
        console.warn('Invalid settings detected, using defaults:', error);
        return defaultSettings;
    }
}

export function validatePartialSettings(settings: Partial<Settings>): Partial<Settings> {
    try {
        return settingsSchema.partial().parse(settings);
    } catch (error) {
        console.warn('Invalid partial settings detected:', error);
        return {};
    }
}

// Migration functions for settings versioning
export function migrateSettings(settings: any, fromVersion: string, toVersion: string): Settings {
    let migrated = { ...settings };

    // Add migration logic here as needed
    if (fromVersion === '0.9.0' && toVersion === '1.0.0') {
        // Migrate editorFontSize to editor.fontSize
        if (migrated.editorFontSize !== undefined) {
            migrated.editor = migrated.editor || {};
            migrated.editor.fontSize = migrated.editorFontSize;
            delete migrated.editorFontSize;
        }
    }

    migrated.version = toVersion;
    return validateSettings(migrated);
}

// Utility functions
export function mergeSettings(base: Settings, overrides: Partial<Settings>): Settings {
    const merged = {
        ...base,
        ...overrides,
        editor: { ...base.editor, ...overrides.editor },
        pdf: { ...base.pdf, ...overrides.pdf },
        files: { ...base.files, ...overrides.files },
        appearance: { ...base.appearance, ...overrides.appearance },
    };

    return validateSettings(merged);
}

export function resetSettingsSection<K extends keyof Settings>(
    settings: Settings,
    section: K
): Settings {
    return {
        ...settings,
        [section]: defaultSettings[section],
    };
}