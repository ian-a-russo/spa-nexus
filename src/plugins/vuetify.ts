import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify, type ThemeDefinition } from 'vuetify';

const cyberDark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#050014',
    surface: '#0d0620',
    'surface-bright': '#190b33',
    primary: '#ff2ec4',
    'primary-darken-1': '#c400a0',
    secondary: '#05d9e8',
    accent: '#b026ff',
    error: '#ff2154',
    warning: '#f9c80e',
    info: '#05d9e8',
    success: '#39ff14',
  },
};

const cyberLight: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#eef0fb',
    surface: '#ffffff',
    'surface-bright': '#ffffff',
    primary: '#c400a0',
    'primary-darken-1': '#8e0074',
    secondary: '#00b4c4',
    accent: '#7b1fd6',
    error: '#e0184a',
    warning: '#d69e00',
    info: '#00b4c4',
    success: '#12a815',
  },
};

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'cyberDark',
    themes: { cyberDark, cyberLight },
  },
  defaults: {
    VBtn: { rounded: 'lg' },
    VTextField: { variant: 'outlined', density: 'comfortable' },
    VCard: { rounded: 'lg' },
  },
});
