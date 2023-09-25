import { createContext, useContext } from 'react'
import { App } from 'obsidian'

// set up App context to pass to React components
// https://docs.obsidian.md/Plugins/Getting+started/Use+React+in+your+plugin#Create+an+App+context
export const AppContext = createContext<App | undefined>(undefined);

export const useApp = (): App | undefined => {
    return useContext(AppContext);
}