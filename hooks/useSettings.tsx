import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from "react";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'PIXEL_TRACKER_SETTINGS'

const SettingsStateContext = createContext(undefined)

export interface SettingsWebhookHistoryEntry {
  url: string,
  date: string,
  body: string,
  statusCode?: number,
  statusText?: string,
  isError: boolean,
  errorMessage?: string,
}

export interface SettingsState {
  deviceId: string | null,
  passcodeEnabled: boolean,
  passcode: string | null,
  webhookEnabled: Boolean,
  webhookUrl: string,
  webhookHistory: SettingsWebhookHistoryEntry[],
  scaleType: 'ColorBrew-RdYlGn' | 'ColorBrew-PiYG',
  reminderEnabled: Boolean,
  reminderTime: string,
}

const initialState: SettingsState = {
  deviceId: null,
  passcodeEnabled: false,
  passcode: null,
  webhookEnabled: false,
  webhookUrl: '',
  webhookHistory: [],
  scaleType: 'ColorBrew-RdYlGn',
  reminderEnabled: false,
  reminderTime: '18:00',
  loaded: false,
}

function SettingsProvider({children}: { children: React.ReactNode }) {
  const [loaded , setLoaded] = useState(false)
  const [settings, setSettings] = useState(initialState)

  const setSettingsProxy = async (settingsOrSettingsFunction: SettingsState | Function) => {
    
    const newSettings = typeof settingsOrSettingsFunction === 'function' ? 
      settingsOrSettingsFunction(settings) : 
      settingsOrSettingsFunction;

    setSettings(newSettings)

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
    } catch (e) {
      console.error(e)
    }
  }
  
  const resetSettings = () => {
    console.log('reset settings')
    setSettingsProxy(initialState)
  }
  
  useEffect(() => {
    const load = async () => {
      const json = await AsyncStorage.getItem(STORAGE_KEY)
      if (json !== null) {
        const newSettings: SettingsState = {
          ...initialState,
          ...JSON.parse(json)
        }
        if(newSettings.deviceId === null) {
          newSettings.deviceId = uuidv4()
        }
        setSettings(newSettings)
      } else {
        setSettingsProxy({
          ...initialState,
          deviceId: uuidv4(),
        })
      }
    }

    try {
      load()
      // console.log('Loaded settings')
    } catch(e) {
      // console.log('Error loading settings', e)
    }
  }, [])

  useEffect(() => {
    if(settings.deviceId !== null) {
      setLoaded(true)
    }
  }, [settings.deviceId])
  
  const value = { 
    settings, 
    loaded,
    setSettings: setSettingsProxy, 
    resetSettings 
  };
  
  return (
    <SettingsStateContext.Provider value={value}>
      {children}
    </SettingsStateContext.Provider>
  )
}

function useSettings(): { 
  settings: SettingsState, 
  loaded: boolean,
  setSettings: (settings: SettingsState) => void, 
  resetSettings: () => void,
} {
  const context = useContext(SettingsStateContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export { SettingsProvider, useSettings };
