import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  pathnames: {
    '/login': {
      en: '/login',
      es: '/iniciar-sesion',
    },
    '/shop-manager/dashboard': {
      en: '/shop-manager/dashboard',
      es: '/shop-manager/dashboard',
    },
    '/shop-manager/dashboard/tasks': {
      en: '/shop-manager/dashboard/tasks',
      es: '/shop-manager/dashboard/tareas',
    },
    '/shop-manager/dashboard/workfiles': {
      en: '/shop-manager/dashboard/workfiles',
      es: '/shop-manager/dashboard/archivos-de-trabajo',
    },
    '/shop-manager/dashboard/opportunities': {
      en: '/shop-manager/dashboard/opportunities',
      es: '/shop-manager/dashboard/oportunidades',
    },
    '/shop-manager/dashboard/opportunities/archive': {
      en: '/shop-manager/dashboard/opportunities/archive',
      es: '/shop-manager/dashboard/oportunidades/archivo',
    },
    '/shop-manager/dashboard/opportunities/estimate': {
      en: '/shop-manager/dashboard/opportunities/estimate',
      es: '/shop-manager/dashboard/oportunidades/estimacion',
    },
    '/shop-manager/dashboard/opportunities/new-opportunities': {
      en: '/shop-manager/dashboard/opportunities/new-opportunities',
      es: '/shop-manager/dashboard/oportunidades/nuevas-oportunidades',
    },
    '/shop-manager/dashboard/opportunities/second-call': {
      en: '/shop-manager/dashboard/opportunities/second-call',
      es: '/shop-manager/dashboard/oportunidades/segunda-llamada',
    },
    '/shop-manager/dashboard/opportunities/total-loss': {
      en: '/shop-manager/dashboard/opportunities/total-loss',
      es: '/shop-manager/dashboard/oportunidades/perdida-total',
    },
    '/shop-manager/dashboard/parts-management': {
      en: '/shop-manager/dashboard/parts-management',
      es: '/shop-manager/dashboard/gerencia-de-piezas',
    },
    '/shop-manager/dashboard/insurances-and-vehicle-owners': {
      en: '/shop-manager/dashboard/insurances-and-vehicle-owners',
      es: '/shop-manager/dashboard/aseguradoras-y-propietarios-de-vehiculos',
    },
    '/shop-manager/dashboard/ai': {
      en: '/shop-manager/dashboard/ai',
      es: '/shop-manager/dashboard/ai',
    },
    '/shop-manager/dashboard/search': {
      en: '/shop-manager/dashboard/search',
      es: '/shop-manager/dashboard/busqueda',
    },
    '/shop-manager/dashboard/user-profile': {
      en: '/shop-manager/dashboard/user-profile',
      es: '/shop-manager/dashboard/perfil-de-usuario',
    },
    '/technician-painter/dashboard': {
      en: '/technician-painter/dashboard',
      es: '/tecnico-pintor/dashboard',
    },
    '/super-admin/dashboard': {
      en: '/super-admin/dashboard',
      es: '/super-administrador/dashboard',
    },
  }
})

export type Locale = (typeof routing.locales)[number]

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
