# The Map File System: Obsidian Plugin

Welcome to the Map File System: the file system built around maps! This project
was designed to help a DnD Game Masters build out their world, with maps as the 
central framework for linking files, documents, and information. 

The idea is simple: imagine that your top directory has a __map__ associated 
with it, the map of your world. You can then populate this map with __pins__, 
which either represent documents or subdirectories, which contain information 
about something within your map at the pin's location. With this, a GM can fill 
out their world by _location_ and use their maps to do so. 

## Development Setup

1. Install [Obsidian](https://obsidian.md/), 
[Node.js](https://nodejs.org/en), and 
[Node Package Manager](https://www.npmjs.com/)

1. Set up the project by running `npm install` in project directory

1. Add a 'test' vault to your project directory
    - add directory called `vault` to project directory
    - open this up in Obsidian to generate `.obsidian` directory
    - add in a `plugins` folder to `.obsidian`, and add an `mfs-obsidian` 
    directory
        - copy `main.js` and `manifest.json` here when building
