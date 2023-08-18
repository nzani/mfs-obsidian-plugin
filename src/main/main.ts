import { App, Menu, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian'
import { MapView, VIEW_TYPE_MAP } from 'src/view/view'
import { MFSDoc } from "src/main/intf"

// Remember to rename these classes and interfaces!

interface MFSSettings {
	mySetting: string
}

const DEFAULT_SETTINGS: MFSSettings = {
	mySetting: 'normal'
}

export default class MFS extends Plugin {
	settings: MFSSettings

	async onload() {

		// load settings and add a settings tab so the user can configure various aspects of the plugin
		await this.loadSettings()
		this.addSettingTab(new MFSSettingTab(this.app, this))

		this.registerView(
			VIEW_TYPE_MAP,
			(leaf) => new MapView(leaf)
		)

		this.registerExtensions(["mfs"], VIEW_TYPE_MAP)

		// menu event for seeing path of a file.. mostly for testing
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				menu.addItem((item) => {
					item
						.setTitle("MFS Item Title from File Menu")
						.setIcon("map")
						.onClick(async () => {
							new Notice(file.path)
						})
				})
			})
		)

		// menu of MFS actions
		this.addRibbonIcon("map", "Open MFS Menu", (event) => {
			const menu = new Menu()

			// menu item for generating .mfs doc
			menu.addItem((item) => 
				item
					.setTitle("Generate MFS Document")
					.setIcon("map")
					.onClick(() => {
						new Notice("You just got beaned")
						new MFSDocGenModal(this.app).open()
					})
			)

			menu.addItem((item) => 
				item
					.setTitle("Place Pin")
					.setIcon("pin")
					.onClick(() => {
						let mapView = this.app.workspace.getActiveViewOfType(MapView)
						if (mapView == null) {
							new Notice("You need to be looking at a map to add a pin!")
						} else {
							mapView?.contentEl.onClickEvent((evt: MouseEvent) => {
								mapView?.displayPin({x: evt.clientX, y: evt.clientY})
								mapView?.rememberPin({ name: "",
													   path: "",
													   coord: {x: evt.clientX, y: evt.clientY}})
								new Notice("Pin created at " + String(evt.clientX) + ", " + String(evt.clientY))
							},
							{once : true})
						}
					})
				
			)

			menu.showAtMouseEvent(event)
		})

		// TODO: add a # of mapPins and # of filePins item
		const statusBarItemEl = this.addStatusBarItem()
		statusBarItemEl.setText('Status Bar Text')

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MFSSettingTab(this.app, this))

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			// console.log(evt.clientX, evt.clientY, evt)
		})
		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000))
	}

	onunload() {
		close()
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_MAP)
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}
}

// if these classes get too large, bring to another file
// Modal for adding .mfs document
class MFSDocGenModal extends Modal {
	mapMetaData: MFSDoc = {name: "", path: "", mapPins: []}

	constructor(app: App) {
		super(app)
	}

	// creates a doc when the user clicks Submit button
	async onSubmit(mapMetaData: MFSDoc) {
		let file = await this.app.vault.create(mapMetaData.name + '.mfs', JSON.stringify(mapMetaData))
	}

	onOpen() {
		const {contentEl} = this

		contentEl.createEl("h1", { text: "Create your .mfs file!" });

		new Setting(contentEl)
		.setName("Map Name")
		.addText((text) =>
			text.onChange((value) => {
				this.mapMetaData.name = value
			}));

		new Setting(contentEl)
		.setName("Map Path")
		.addText((text) =>
			text.onChange((value) => {
				this.mapMetaData.path = value
			}));

		new Setting(contentEl)
		.addButton((btn) =>
			btn
			.setButtonText("Submit")
			.setCta()
			.onClick(() => {
				this.close();
				this.onSubmit(this.mapMetaData)
			}));
	}

	onClose() {
		const {contentEl} = this
		contentEl.empty()
	}
}

// settings tab for the plugin
class MFSSettingTab extends PluginSettingTab {
	plugin: MFS

	constructor(app: App, plugin: MFS) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const {containerEl} = this

		containerEl.empty()

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value
					await this.plugin.saveSettings()
				}))
	}
}
