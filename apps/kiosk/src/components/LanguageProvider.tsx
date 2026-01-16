'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'en' | 'es' | 'zh'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'home.welcome': 'Welcome to Hospital Kiosk',
    'home.subtitle': 'Select a service to get started',
    'home.checkIn': 'Check In',
    'home.checkInDesc': 'Check in for your appointment',
    'home.register': 'New Patient',
    'home.registerDesc': 'Register as a new patient',
    'home.schedule': 'Schedule Appointment',
    'home.scheduleDesc': 'Book a new appointment',
    'home.directions': 'Directions',
    'home.directionsDesc': 'Find your way around',
    'home.queueStatus': 'Wait Times',
    'home.queueStatusDesc': 'View current wait times',
    'home.payment': 'Make Payment',
    'home.paymentDesc': 'Pay your co-pay or bill',
    'home.needHelp': 'Need help? Ask staff at the front desk',

    'checkIn.title': 'Check In',
    'checkIn.verifyIdentity': 'Verify Your Identity',
    'checkIn.dateOfBirth': 'Date of Birth',
    'checkIn.phoneNumber': 'Phone Number',
    'checkIn.scanInsurance': 'Scan Insurance Card',
    'checkIn.insuranceScanned': 'Card Scanned Successfully',
    'checkIn.placeCard': 'Place your insurance card on the scanner',
    'checkIn.scanCard': 'Scan Card',
    'checkIn.skipInsurance': 'Skip for Now',
    'checkIn.confirmInfo': 'Confirm Your Information',
    'checkIn.insurance': 'Insurance',
    'checkIn.scanned': 'Scanned',
    'checkIn.notScanned': 'Not Scanned',
    'checkIn.success': 'Check-In Complete!',
    'checkIn.successMessage': 'Please have a seat. You will be called shortly.',

    'register.title': 'New Patient Registration',
    'register.personalInfo': 'Personal Information',
    'register.firstName': 'First Name',
    'register.lastName': 'Last Name',
    'register.dateOfBirth': 'Date of Birth',
    'register.contactInfo': 'Contact Information',
    'register.address': 'Street Address',
    'register.city': 'City',
    'register.state': 'State',
    'register.zipCode': 'ZIP Code',
    'register.phoneNumber': 'Phone Number',
    'register.email': 'Email Address',
    'register.emergencyContact': 'Emergency Contact',
    'register.emergencyName': 'Contact Name',
    'register.emergencyPhone': 'Contact Phone',
    'register.emergencyRelation': 'Relationship',
    'register.reviewInfo': 'Review Your Information',
    'register.name': 'Name',
    'register.cityStateZip': 'City, State ZIP',
    'register.relation': 'Relationship',
    'register.success': 'Registration Complete!',
    'register.successMessage': 'Your patient profile has been created successfully.',

    'schedule.title': 'Schedule Appointment',
    'schedule.selectDepartment': 'Select Department',
    'schedule.selectProvider': 'Select Provider',
    'schedule.selectDateTime': 'Select Date & Time',
    'schedule.selectDate': 'Select a Date',
    'schedule.selectTime': 'Select a Time',
    'schedule.confirmAppointment': 'Confirm Your Appointment',
    'schedule.department': 'Department',
    'schedule.provider': 'Provider',
    'schedule.date': 'Date',
    'schedule.time': 'Time',
    'schedule.confirmationNote': 'You will receive a confirmation email and SMS reminder.',
    'schedule.success': 'Appointment Scheduled!',
    'schedule.successMessage': 'Your appointment is confirmed for',

    'directions.title': 'Directions & Wayfinding',
    'directions.selectDestination': 'Where do you need to go?',
    'directions.searchPlaceholder': 'Search for a location...',
    'directions.noResults': 'No locations found',
    'directions.howToGetThere': 'How to Get There',
    'directions.mapPlaceholder': 'Interactive map would be displayed here',
    'directions.backToList': 'Back to Location List',

    'queueStatus.title': 'Wait Times',
    'queueStatus.currentWaitTimes': 'Current Wait Times',
    'queueStatus.updatesEvery': 'Updates every',
    'queueStatus.seconds': 'seconds',
    'queueStatus.waitTime': 'Wait Time',
    'queueStatus.min': 'min',
    'queueStatus.waiting': 'Waiting',
    'queueStatus.statusLow': 'Low',
    'queueStatus.statusMedium': 'Moderate',
    'queueStatus.statusHigh': 'High',
    'queueStatus.disclaimer': 'Wait times are approximate and may vary. Please check with staff for more information.',

    'payment.title': 'Make Payment',
    'payment.enterAmount': 'Enter Payment Amount',
    'payment.coPayAmount': 'Co-Pay Amount',
    'payment.commonAmounts': 'Common Amounts',
    'payment.selectMethod': 'Select Payment Method',
    'payment.creditCard': 'Credit Card',
    'payment.debitCard': 'Debit Card',
    'payment.processPayment': 'Process Payment',
    'payment.insertCard': 'Insert or Tap Your Card',
    'payment.insertCardDesc': 'Follow the prompts on the card reader',
    'payment.paymentSummary': 'Payment Summary',
    'payment.amount': 'Amount',
    'payment.processButton': 'Process Payment',
    'payment.processing': 'Processing Payment...',
    'payment.success': 'Payment Successful!',
    'payment.successMessage': 'Your payment has been processed:',

    'common.back': 'Back',
    'common.next': 'Next',
    'common.submit': 'Submit',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
  },
  es: {
    'home.welcome': 'Bienvenido al Kiosco del Hospital',
    'home.subtitle': 'Seleccione un servicio para comenzar',
    'home.checkIn': 'Registrarse',
    'home.checkInDesc': 'Regístrese para su cita',
    'home.register': 'Paciente Nuevo',
    'home.registerDesc': 'Regístrese como paciente nuevo',
    'home.schedule': 'Programar Cita',
    'home.scheduleDesc': 'Reserve una nueva cita',
    'home.directions': 'Direcciones',
    'home.directionsDesc': 'Encuentre su camino',
    'home.queueStatus': 'Tiempos de Espera',
    'home.queueStatusDesc': 'Ver tiempos de espera actuales',
    'home.payment': 'Hacer Pago',
    'home.paymentDesc': 'Pague su copago o factura',
    'home.needHelp': '¿Necesita ayuda? Consulte al personal en la recepción',

    'checkIn.title': 'Registrarse',
    'checkIn.success': 'Registro Completo',
    'checkIn.successMessage': 'Por favor tome asiento. Le llamarán pronto.',

    'register.title': 'Registro de Paciente Nuevo',
    'register.success': 'Registro Completo',
    'register.successMessage': 'Su perfil de paciente ha sido creado exitosamente.',

    'schedule.title': 'Programar Cita',
    'schedule.success': 'Cita Programada',
    'schedule.successMessage': 'Su cita está confirmada para',

    'directions.title': 'Direcciones',
    'queueStatus.title': 'Tiempos de Espera',
    'payment.title': 'Hacer Pago',

    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.submit': 'Enviar',
    'common.confirm': 'Confirmar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
  },
  zh: {
    'home.welcome': '欢迎使用医院自助服务终端',
    'home.subtitle': '选择一项服务开始',
    'home.checkIn': '登记',
    'home.checkInDesc': '为您的预约登记',
    'home.register': '新患者',
    'home.registerDesc': '注册为新患者',
    'home.schedule': '预约',
    'home.scheduleDesc': '预约新的就诊',
    'home.directions': '指引',
    'home.directionsDesc': '查找路线',
    'home.queueStatus': '等待时间',
    'home.queueStatusDesc': '查看当前等待时间',
    'home.payment': '付款',
    'home.paymentDesc': '支付您的费用',
    'home.needHelp': '需要帮助？请咨询前台工作人员',

    'checkIn.title': '登记',
    'checkIn.success': '登记完成',
    'checkIn.successMessage': '请就座。我们很快会叫您。',

    'register.title': '新患者注册',
    'register.success': '注册完成',
    'register.successMessage': '您的患者档案已成功创建。',

    'schedule.title': '预约',
    'schedule.success': '预约成功',
    'schedule.successMessage': '您的预约已确认',

    'directions.title': '指引',
    'queueStatus.title': '等待时间',
    'payment.title': '付款',

    'common.back': '返回',
    'common.next': '下一步',
    'common.submit': '提交',
    'common.confirm': '确认',
    'common.cancel': '取消',
    'common.edit': '编辑',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
