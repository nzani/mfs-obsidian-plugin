import { App, HoverPopover, Menu, Modal, Notice, Plugin, PluginSettingTab, Setting, ToggleComponent } from 'obsidian'
import { MapView, VIEW_TYPE_MAP } from 'src/view/view'
import { MapViewProps, MapPinProps } from "src/main/intf"

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
							new MFSPinGenModal(this.app, mapView).open()
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
	mapMetaData: MapViewProps = {name: "", path: "", pins: []}

	constructor(app: App) {
		super(app)
	}

	// creates a doc when the user clicks submit button
	async onSubmit() {
		await this.app.vault.create(this.mapMetaData.name + '.mfs', 
								  	JSON.stringify(this.mapMetaData))
	}

	onOpen() {
		const {contentEl} = this

		contentEl.createEl("h1", { text: "Create your .mfs file!" });

		// map name entry
		new Setting(contentEl)
		.setName("Map Name")
		.addText((text) =>
			text.onChange((value) => {
				this.mapMetaData.name = value
			}));

		// map image path entry
		new Setting(contentEl)
		.setName("Map Path")
		.addText((text) =>
			text.onChange((value) => {
				this.mapMetaData.path = value
			}));

		// submit button + action (see onSubmit)
		new Setting(contentEl)
		.addButton((btn) =>
			btn
			.setButtonText("Submit")
			.setCta()
			.onClick(() => {
				this.close();
				this.onSubmit()
			}));
	}

	onClose() {
		const {contentEl} = this
		contentEl.empty()
	}
}

// Modal for adding a new pin to the MapView
class MFSPinGenModal extends Modal {
	mapView: MapView
	pinMetaData: MapPinProps = {name: "", path: "", coord: {x: 0, y: 0}}
	isDirectory: boolean

	constructor(app: App, mapView: MapView) {
		super(app)
		this.mapView = mapView
	}

	onSubmit() {
		if (this.isDirectory) {
			// create the new folder name
			let currentFileParent = this.app.workspace.getActiveFile()?.parent?.name
			let newFolderName = currentFileParent + '/' + this.pinMetaData.name
			this.app.vault.createFolder(newFolderName)
			
			// create the associated .mfs doc
			// TODO: add a blank map file 
			this.app.vault.create(newFolderName + '/' + this.pinMetaData.name + '.mfs', 
								  JSON.stringify({name: this.pinMetaData.name, 
												  path: this.pinMetaData.path,
												  mapPins: []}))
									
			// use @n8atnite hack here to copy assets/sample_map.png 
			// this.app.vault.copy()						
			
		} else {
			// if not a new map, just create a new map
			this.app.vault.create(this.pinMetaData.name + '.md', "")
		}

		new Notice("Click on your map to place your new pin")

		// creates a new event that triggers once when the map is clicked
		this.mapView.contentEl.onClickEvent((evt: MouseEvent) => {
			let pin = {name: this.pinMetaData.name, 
					   path: this.pinMetaData.path,
					   coord: {x: evt.clientX, y: evt.clientY}}

			// displays the pin in the MapView
			// this.mapView.displayPin(pin)
			
			// records the pin in the MapView
			// this.mapView.savePin(pin)

			// TODO: notify MapComponent of new pin with addPin callback

			new Notice("Pin created at " + String(evt.clientX) + ", " + String(evt.clientY))
		}, {once : true})
	}

	onOpen() {
		const {contentEl} = this

		contentEl.createEl("h1", { text: "Add a pin to your map" });

		// entry for pin name
		new Setting(contentEl)
		.setName("Pin Name")
		.addText((text) =>
			text.onChange((value) => {
				this.pinMetaData.name = value
			}))

		// entry for pin data path (file if just regular pin, map path if map)
		new Setting(contentEl)
		.setName("Pin Path")
		.addText((text) => 
			text.onChange((value) => {
				this.pinMetaData.path = value
			}))

		// toggle for whether or not this will be a new map
		new Setting(contentEl)
		.setName("New Map?")
		.addToggle((tc: ToggleComponent) => {
			tc.onChange((enabled:boolean) => {
				this.isDirectory = enabled
			})
		})

		// submit button + actions to take when submitted
		new Setting(contentEl)
		.addButton((btn) =>
			btn
			.setButtonText("Submit")
			.setCta()
			.onClick(() => {
				this.close();
				this.onSubmit()
			}));
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
