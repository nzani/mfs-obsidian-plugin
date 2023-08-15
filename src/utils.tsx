import { App, Menu, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, arrayBufferToBase64, FileView, WorkspaceLeaf, TFile, FileSystemAdapter } from "obsidian"
import MFS from "./main/main"
import * as path from 'path';

// load static assets (from https://forum.obsidian.md/t/support-for-assets-in-plugins/25837/3)
export function loadAsset(plugin: MFS, assetPath: string) {
    return plugin.app.vault.adapter.getResourcePath(path.join(plugin.app.vault.configDir, "plugins", plugin.manifest.id, assetPath))
}