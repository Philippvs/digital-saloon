export type Messages = {
  'nav.myBookings': string
  'nav.staffCalendar': string
  'nav.staffSettings': string
  'nav.staffLogin': string
  'nav.signedInAs': string
  'nav.main': string
  'nav.signOut': string
  'nav.language': string
  'nav.book': string
  'nav.home': string

  'home.place': string
  'home.intro': string
  'home.book': string
  'home.call': string
  'home.servicesTitle': string
  'home.servicesHint': string
  'home.servicesError': string
  'home.servicesEmpty': string
  'home.hoursTitle': string
  'home.hoursError': string
  'home.closed': string
  'home.today': string
  'home.visitTitle': string
  'home.stylistsTitle': string
  'home.stylesTitle': string
  'home.stylesHint': string
  'home.directions': string
  'footer.vatId': string

  'book.title': string
  'book.subtitle': string
  'book.step.service': string
  'book.step.date': string
  'book.step.time': string
  'book.step.details': string
  'book.step.confirm': string
  'book.servicesLoading': string
  'book.servicesError': string
  'book.availabilityLoading': string
  'book.availabilityError': string
  'book.noSlotsMonth': string
  'book.noSlotsDay': string
  'book.monthPrev': string
  'book.monthNext': string
  'book.firstName': string
  'book.lastName': string
  'book.phone': string
  'book.phoneHelp': string
  'book.privacy': string
  'book.submit': string
  'book.submitting': string
  'book.otherTime': string
  'book.durationMinutes': string
  'book.weekday.mo': string
  'book.weekday.tu': string
  'book.weekday.we': string
  'book.weekday.th': string
  'book.weekday.fr': string
  'book.weekday.sa': string
  'book.weekday.su': string
  'book.step1Title': string
  'book.step2Title': string
  'book.continueToDate': string
  'book.backToServices': string
  'book.selectedServicesCount': string
  'book.totalDuration': string
  'book.totalPrice': string
  'book.categoryOther': string
  'book.weekPrev': string
  'book.weekNext': string
  'book.expandCalendar': string
  'book.collapseCalendar': string
  'book.noSlotsWeek': string
  'book.email': string
  'book.notes': string
  'book.notesPlaceholder': string
  'price.onRequest': string

  'confirmed.pendingTitle': string
  'confirmed.confirmedTitle': string
  'confirmed.pendingBody': string
  'confirmed.confirmedBody': string
  'confirmed.emailSentNote': string
  'confirmed.saveWarning': string
  'confirmed.linkHeading': string
  'confirmed.manage': string
  'confirmed.copy': string
  'confirmed.share': string
  'confirmed.mailto': string
  'confirmed.myBookings': string
  'confirmed.home': string
  'confirmed.copied': string
  'confirmed.shared': string
  'confirmed.shareTitle': string
  'confirmed.shareText': string

  'myBookings.title': string
  'myBookings.subtitle': string
  'myBookings.empty': string
  'myBookings.open': string
  'myBookings.copy': string
  'myBookings.share': string
  'myBookings.mailto': string
  'myBookings.remove': string
  'myBookings.bookNew': string
  'myBookings.home': string
  'myBookings.invalid': string
  'myBookings.status': string
  'myBookings.removed': string
  'myBookings.copied': string
  'myBookings.copyFailed': string
  'myBookings.shared': string
  'myBookings.loading': string
  'myBookings.shareTitle': string
  'myBookings.shareText': string

  'manage.title': string
  'manage.subtitle': string
  'manage.loading': string
  'manage.notFound': string
  'manage.status': string
  'manage.reschedule': string
  'manage.cancelReschedule': string
  'manage.cancel': string
  'manage.cancelling': string
  'manage.immutable': string
  'manage.pickTime': string
  'manage.slotsLoading': string
  'manage.noAlternatives': string
  'manage.home': string
  'manage.actionFailed': string

  'status.PENDING': string
  'status.CONFIRMED': string
  'status.DECLINED': string
  'status.EXPIRED': string
  'status.CANCELLED': string
  'status.COMPLETED': string

  'login.title': string
  'login.email': string
  'login.password': string
  'login.submit': string
  'login.submitting': string
  'login.hint': string
  'login.staffOnly': string
  'login.customerNote': string
  'login.failed': string
  'login.backHome': string

  'error.somethingWrong': string
  'error.tryAgain': string

  'admin.title': string
  'admin.calendar': string
  'admin.reservations': string
  'admin.time': string
  'admin.customer': string
  'admin.status': string
  'admin.open': string
  'admin.toCalendar': string
  'admin.noReservations': string
  'admin.reservationsError': string
  'admin.services': string
  'admin.service': string
  'admin.settings': string
  'admin.maintenance': string
  'admin.maintenanceHint': string
  'admin.expirePending': string
  'admin.expireResult': string
  'admin.loading': string
  'admin.signInRequired': string
  'admin.forbidden': string
  'admin.today': string
  'admin.allReservations': string
  'admin.calendarLoading': string
  'admin.detailTitle': string
  'admin.backToCalendar': string
  'admin.detailLoading': string
  'admin.notFound': string
  'admin.source': string
  'admin.note': string
  'admin.customerNotes': string
  'admin.confirm': string
  'admin.decline': string
  'admin.complete': string
  'admin.cancel': string
  'admin.manualTitle': string
  'admin.manualSubtitle': string
  'admin.back': string
  'admin.dayLabel': string
  'admin.noSlots': string
  'admin.emailOptional': string
  'admin.noteOptional': string
  'admin.saving': string
  'admin.createReservation': string
  'admin.servicesSubtitle': string
  'admin.servicesLoading': string
  'admin.servicesError': string
  'admin.noServices': string
  'admin.newService': string
  'admin.editServiceLabel': string
  'admin.edit': string
  'admin.editServiceTitle': string
  'admin.servicesKeepHint': string
  'admin.fieldDescription': string
  'admin.fieldDescriptionHint': string
  'admin.fieldDurationHint': string
  'admin.fieldActive': string
  'admin.fieldActiveHint': string
  'admin.inactiveTag': string
  'admin.cancelEdit': string
  'admin.priceError': string
  'admin.name': string
  'admin.fieldNameDe': string
  'admin.fieldNameIt': string
  'admin.fieldDescriptionDe': string
  'admin.fieldDescriptionIt': string
  'admin.duration': string
  'admin.price': string
  'admin.active': string
  'admin.yes': string
  'admin.no': string
  'admin.minutes': string
  'admin.durationFrom': string
  'admin.durationTo': string
  'admin.priceFrom': string
  'admin.priceTo': string
  'admin.homepage': string
  'admin.homepageSubtitle': string
  'admin.homepageEditButton': string
  'admin.homepageSectionsTitle': string
  'admin.homepageSectionsHint': string
  'admin.homepageSectionHero': string
  'admin.homepageSectionServices': string
  'admin.homepageSectionStyles': string
  'admin.homepageSectionStylists': string
  'admin.homepageSectionVisit': string
  'admin.homepageGalleryTitle': string
  'admin.homepageGalleryHint': string
  'admin.homepageUploadImage': string
  'admin.homepageUploading': string
  'admin.homepageImageUrl': string
  'admin.homepageImageAltDe': string
  'admin.homepageImageAltIt': string
  'admin.homepageAddImage': string
  'admin.homepageRemoveImage': string
  'admin.homepageResetGallery': string
  'admin.homepageCustomSectionsTitle': string
  'admin.homepageAddSection': string
  'admin.homepageRemoveSection': string
  'admin.homepageSectionTitleDe': string
  'admin.homepageSectionTitleIt': string
  'admin.homepageSectionBodyDe': string
  'admin.homepageSectionBodyIt': string
  'admin.homepageSectionImage': string
  'home.carouselPrev': string
  'home.carouselNext': string
  'admin.demoModeTitle': string
  'admin.demoModeHint': string
  'admin.demoModeSwitch': string
  'admin.firstAdminTitle': string
  'admin.firstAdminHint': string
  'admin.firstAdminCreated': string
  'admin.firstAdminCreateButton': string
  'admin.firstAdminAlreadyExists': string
  'admin.employeesTitle': string
  'admin.employeesHint': string
  'admin.employeeCreateButton': string
  'admin.employeeCreated': string
  'admin.primaryAdminBadge': string
  'admin.accountDisplayName': string
  'admin.accountEmail': string
  'admin.accountPassword': string
  'admin.settingsSubtitle': string
  'admin.settingsLoading': string
  'admin.settingsError': string
  'admin.confirmationMode': string
  'admin.slotInterval': string
  'admin.minAdvance': string
  'admin.maxAdvance': string
  'admin.pendingExpiration': string
  'admin.openingHours': string
  'admin.openingHoursLoading': string
  'admin.openingHoursError': string
  'admin.closed': string

  'hours.title': string
  'hours.subtitle': string
  'hours.weeklyTitle': string
  'hours.weeklyHint': string
  'hours.open': string
  'hours.from': string
  'hours.to': string
  'hours.addInterval': string
  'hours.removeInterval': string
  'hours.copyToOpenDays': string
  'hours.copied': string
  'hours.intervalOrder': string
  'hours.intervalOverlap': string
  'hours.intervalInvalid': string
  'hours.unsaved': string
  'hours.absencesTitle': string
  'hours.absencesHint': string
  'hours.addAbsence': string
  'hours.absencesEmpty': string
  'hours.absencesError': string
  'hours.kindQuestion': string
  'hours.kindDays': string
  'hours.kindDaysHint': string
  'hours.kindMorning': string
  'hours.kindMorningHint': string
  'hours.kindAfternoon': string
  'hours.kindAfternoonHint': string
  'hours.kindCustom': string
  'hours.kindCustomHint': string
  'hours.firstDay': string
  'hours.lastDay': string
  'hours.date': string
  'hours.note': string
  'hours.notePlaceholder': string
  'hours.defaultName': string
  'hours.dayCount': string
  'hours.openThen': string
  'hours.closedThen': string
  'hours.customHint': string
  'hours.conflicts': string
  'hours.dateRequired': string
  'hours.endBeforeStart': string
  'hours.tooLong': string
  'hours.checkIntervals': string
  'hours.submitAbsence': string
  'hours.dialogCancel': string
  'hours.deleteAbsence': string
  'hours.closedAllDay': string
  'hours.openOnly': string

  'admin.statPending': string
  'admin.pendingEmpty': string
  'admin.manageTitle': string
  'admin.addReservation': string
  'admin.bookingRulesTitle': string
  'admin.modeAutomatic': string
  'admin.modeAutomaticHint': string
  'admin.modeManual': string
  'admin.modeManualHint': string
  'admin.slotIntervalHint': string
  'admin.minAdvanceHint': string
  'admin.maxAdvanceHint': string
  'admin.pendingExpirationHint': string
  'admin.unitMinutes': string
  'admin.unitDays': string
  'admin.unitHours': string
  'admin.salonDetailsTitle': string
  'admin.salonDetailsHint': string
  'admin.fieldName': string
  'admin.fieldAddress': string
  'admin.fieldPhone': string
  'admin.fieldEmail': string
  'admin.fieldVatId': string
  'admin.save': string
  'admin.saved': string
  'admin.saveFailed': string
  'admin.rangeError': string
  'admin.requiredError': string
  'admin.emailError': string
  'admin.tooLongError': string
  'admin.backToDashboard': string
  'admin.weekNumber': string
  'admin.prevWeek': string
  'admin.nextWeek': string
  'admin.thisWeek': string
  'admin.weekTotals': string
  'admin.totalCount': string
  'admin.totalTime': string
  'admin.totalRevenue': string
  'admin.plannerLabel': string
  'admin.plannerLegend': string
  'admin.plannerAddAt': string
  'admin.plannerAddHint': string
  'admin.plannerDayFree': string
  'admin.plannerCount': string
  'admin.plannerCountOne': string
}

export type MessageKey = keyof Messages

export const de: Messages = {
  'nav.myBookings': 'Meine Termine',
  'nav.staffCalendar': 'Kalender',
  'nav.staffSettings': 'Einstellungen',
  'nav.staffLogin': 'Login für das Team',
  'nav.signedInAs': 'Angemeldet als {email}',
  'nav.main': 'Hauptnavigation',
  'nav.signOut': 'Abmelden',
  'nav.language': 'Sprache',
  'nav.book': 'Termin buchen',
  'nav.home': 'KIMM Hair, zur Startseite',

  'home.place': 'Friseur in Meran',
  'home.intro':
    'Judith Lintner und ihr Team schneiden, färben und pflegen in der Via Piave. Mit Zeit für Ihre Wünsche und Produkten, die Haar und Kopfhaut schonen.',
  'home.book': 'Termin online buchen',
  'home.call': 'Oder anrufen: {phone}',
  'home.servicesTitle': 'Leistungen und Preise',
  'home.servicesHint': 'Wählen Sie eine Leistung, um direkt einen Termin zu suchen.',
  'home.servicesError': 'Die Preisliste konnte nicht geladen werden. Rufen Sie uns gerne an.',
  'home.servicesEmpty': 'Die Preisliste wird gerade überarbeitet. Rufen Sie uns gerne an.',
  'home.hoursTitle': 'Öffnungszeiten',
  'home.hoursError': 'Die Öffnungszeiten konnten nicht geladen werden.',
  'home.closed': 'geschlossen',
  'home.today': 'heute',
  'home.visitTitle': 'So finden Sie uns',
  'home.stylistsTitle': 'Stylistinnen',
  'home.stylesTitle': 'Styles',
  'home.stylesHint': 'Ausgewählte Schnitte, Balayage-Techniken und Colorationen aus unserem Salon.',
  'home.directions': 'Route in Google Maps öffnen',
  'footer.vatId': 'MwSt.-Nr.',

  'book.title': 'Termin buchen',
  'book.subtitle': 'Ohne Kundenkonto — Schritt für Schritt zum Wunschtermin.',
  'book.step.service': '1. Leistung wählen',
  'book.step.date': '2. Datum wählen',
  'book.step.time': '3. Uhrzeit wählen',
  'book.step.details': '4. Kontaktdaten',
  'book.step.confirm': '5. Bestätigen',
  'book.servicesLoading': 'Leistungen werden geladen…',
  'book.servicesError': 'Leistungen konnten nicht geladen werden.',
  'book.availabilityLoading': 'Verfügbarkeit wird geladen…',
  'book.availabilityError': 'Verfügbarkeit konnte nicht geladen werden.',
  'book.noSlotsMonth': 'In diesem Zeitraum sind keine Termine frei. Bitte anderen Monat prüfen.',
  'book.noSlotsDay': 'Keine freien Zeiten an diesem Tag.',
  'book.monthPrev': 'Zurück',
  'book.monthNext': 'Weiter',
  'book.firstName': 'Vorname',
  'book.lastName': 'Nachname',
  'book.phone': 'Telefon',
  'book.phoneHelp': 'z. B. 0660 1234567 — wird international gespeichert',
  'book.privacy': 'Ich habe die Datenschutzhinweise zur Kenntnis genommen.',
  'book.submit': 'Termin verbindlich anfragen',
  'book.submitting': 'Wird gebucht…',
  'book.otherTime': 'Andere Zeit',
  'book.durationMinutes': '{minutes} Min',
  'book.weekday.mo': 'Mo',
  'book.weekday.tu': 'Di',
  'book.weekday.we': 'Mi',
  'book.weekday.th': 'Do',
  'book.weekday.fr': 'Fr',
  'book.weekday.sa': 'Sa',
  'book.weekday.su': 'So',
  'book.step1Title': 'Schritt 1 von 2: Leistungen wählen',
  'book.step2Title': 'Schritt 2 von 2: Termin & Kontaktdaten',
  'book.continueToDate': 'Weiter zur Terminauswahl',
  'book.backToServices': 'Zurück zu den Leistungen',
  'book.selectedServicesCount': '{count} gewählt',
  'book.totalDuration': 'Gesamtdauer: {minutes} Min',
  'book.totalPrice': 'Gesamtpreis: {price}',
  'book.categoryOther': 'Weitere Leistungen',
  'book.weekPrev': 'Vorherige Woche',
  'book.weekNext': 'Nächste Woche',
  'book.expandCalendar': 'Monatsansicht aufklappen',
  'book.collapseCalendar': 'Wochenansicht einklappen',
  'book.noSlotsWeek': 'In dieser Woche sind keine Termine frei. Bitte nächste Woche prüfen.',
  'book.email': 'E-Mail-Adresse',
  'book.notes': 'Notizen / Wünsche (optional)',
  'book.notesPlaceholder': 'Hinweise oder Wünsche an den Friseur…',
  'price.onRequest': 'Preis nach Beratung',

  'confirmed.pendingTitle': 'Anfrage eingegangen',
  'confirmed.confirmedTitle': 'Termin bestätigt',
  'confirmed.pendingBody': 'Der Salon prüft Ihre Anfrage. Der Zeitslot ist vorerst reserviert.',
  'confirmed.confirmedBody': 'Ihr Termin ist gebucht — wir freuen uns auf Ihren Besuch!',
  'confirmed.emailSentNote':
    'Eine E-Mail mit allen Termindetails, Ihrem persönlichen Verwaltungs-Link und dem Kalendereintrag (.ics) ist unterwegs zu Ihnen.',
  'confirmed.saveWarning':
    'Speichern Sie diesen persönlichen Link. Ohne Kundenkonto ist er der einzige Zugang zum Termin. Er wurde auf diesem Gerät unter „Meine Termine“ hinterlegt.',
  'confirmed.linkHeading': 'Ihr Verwaltungs-Link',
  'confirmed.manage': 'Termin verwalten',
  'confirmed.copy': 'Link kopieren',
  'confirmed.share': 'Teilen',
  'confirmed.mailto': 'Per E-Mail senden',
  'confirmed.myBookings': 'Meine Termine',
  'confirmed.home': 'Zur Startseite',
  'confirmed.copied': 'Link in die Zwischenablage kopiert.',
  'confirmed.shared': 'Link geteilt.',
  'confirmed.shareTitle': 'Mein Salon-Termin',
  'confirmed.shareText':
    'Hier ist mein persönlicher Link zum Verwalten des Termins. Bitte aufbewahren.',

  'myBookings.title': 'Meine Termine',
  'myBookings.subtitle':
    'Auf diesem Gerät gespeicherte Verwaltungs-Links. Details werden sicher vom Server geladen.',
  'myBookings.empty':
    'Noch keine Termine auf diesem Gerät. Nach einer Buchung erscheint der Link hier automatisch.',
  'myBookings.open': 'Termin öffnen',
  'myBookings.copy': 'Link kopieren',
  'myBookings.share': 'Teilen',
  'myBookings.mailto': 'Per E-Mail senden',
  'myBookings.remove': 'Von diesem Gerät entfernen',
  'myBookings.bookNew': 'Neuen Termin buchen',
  'myBookings.home': 'Zur Startseite',
  'myBookings.invalid':
    'Link ungültig oder Termin nicht mehr verfügbar (abgelaufen, storniert oder gelöscht).',
  'myBookings.status': 'Status: {status}',
  'myBookings.removed': 'Termin von diesem Gerät entfernt.',
  'myBookings.copied': 'Link kopiert.',
  'myBookings.copyFailed': 'Kopieren nicht möglich.',
  'myBookings.shared': 'Link geteilt.',
  'myBookings.loading': 'Termin laden',
  'myBookings.shareTitle': 'Mein Salon-Termin',
  'myBookings.shareText': 'Hier ist mein persönlicher Link zum Verwalten des Termins.',

  'manage.title': 'Termin verwalten',
  'manage.subtitle': 'Persönlicher Link — kein Login erforderlich.',
  'manage.loading': 'Termin laden',
  'manage.notFound': 'Termin nicht gefunden oder Link ungültig.',
  'manage.status': 'Status: {status}',
  'manage.reschedule': 'Umbuchen',
  'manage.cancelReschedule': 'Abbrechen',
  'manage.cancel': 'Stornieren',
  'manage.cancelling': 'Wird storniert…',
  'manage.immutable': 'Dieser Termin kann nicht mehr geändert werden.',
  'manage.pickTime': 'Neue Uhrzeit wählen',
  'manage.slotsLoading': 'Slots laden',
  'manage.noAlternatives': 'Keine Alternativen in den nächsten Tagen.',
  'manage.home': 'Zur Startseite',
  'manage.actionFailed': 'Aktion fehlgeschlagen',

  'status.PENDING': 'Ausstehend',
  'status.CONFIRMED': 'Bestätigt',
  'status.DECLINED': 'Abgelehnt',
  'status.EXPIRED': 'Abgelaufen',
  'status.CANCELLED': 'Storniert',
  'status.COMPLETED': 'Erledigt',

  'login.title': 'Admin-Anmeldung',
  'login.email': 'E-Mail',
  'login.password': 'Passwort',
  'login.submit': 'Als Admin anmelden',
  'login.submitting': 'Wird angemeldet…',
  'login.hint': 'Lokal nach Seed: admin@salonflow.local / password123',
  'login.staffOnly':
    'Nur für Salon-Mitarbeiter. Kunden buchen Termine ohne Login — zurück zur Startseite.',
  'login.customerNote': 'Kunden buchen Termine ohne Login über die Startseite.',
  'login.failed': 'Anmeldung fehlgeschlagen',
  'login.backHome': 'Zur Kunden-Startseite',

  'error.somethingWrong': 'Etwas ist schiefgelaufen',
  'error.tryAgain': 'Erneut versuchen',

  'admin.title': 'Admin',
  'admin.calendar': 'Kalender',
  'admin.reservations': 'Termine',
  'admin.time': 'Zeit',
  'admin.customer': 'Kunde',
  'admin.status': 'Status',
  'admin.open': 'Öffnen',
  'admin.toCalendar': 'Zum Kalender',
  'admin.noReservations': 'Keine Termine im Zeitraum.',
  'admin.reservationsError': 'Termine konnten nicht geladen werden.',
  'admin.services': 'Leistungen',
  'admin.service': 'Leistung',
  'admin.settings': 'Einstellungen',
  'admin.maintenance': 'Wartung',
  'admin.maintenanceHint': 'Abgelaufene ausstehende Anfragen manuell prüfen (auch per Zeitplan).',
  'admin.expirePending': 'Ausstehende Anfragen ablaufen lassen',
  'admin.expireResult': 'Ablauf: {expired} von {scanned} ausstehenden Anfragen abgelaufen.',
  'admin.loading': 'Laden…',
  'admin.signInRequired': 'Anmeldung erforderlich.',
  'admin.forbidden': 'Dieser Bereich ist nur für Salon-Administratoren.',
  'admin.today': 'Heute',
  'admin.allReservations': 'Alle Termine',
  'admin.calendarLoading': 'Kalender laden',
  'admin.detailTitle': 'Termin-Details',
  'admin.backToCalendar': 'Zurück zum Kalender',
  'admin.detailLoading': 'Termin laden',
  'admin.notFound': 'Termin nicht gefunden.',
  'admin.source': 'Quelle: {source}',
  'admin.note': 'Notiz: {note}',
  'admin.customerNotes': 'Kundenhinweis: {notes}',
  'admin.confirm': 'Bestätigen',
  'admin.decline': 'Ablehnen',
  'admin.complete': 'Als erledigt markieren',
  'admin.cancel': 'Stornieren',
  'admin.manualTitle': 'Manueller Termin',
  'admin.manualSubtitle':
    'Für Telefonbuchungen — wird sofort bestätigt. Advance-Limits gelten nicht.',
  'admin.back': 'Zurück',
  'admin.dayLabel': 'Tag',
  'admin.noSlots': 'Keine freien Slots.',
  'admin.emailOptional': 'E-Mail (optional)',
  'admin.noteOptional': 'Interne Notiz (optional)',
  'admin.saving': 'Wird gespeichert…',
  'admin.createReservation': 'Termin anlegen',
  'admin.servicesSubtitle': 'Preisliste für die Website und für Termine, die Sie selbst eintragen.',
  'admin.servicesLoading': 'Leistungen laden',
  'admin.servicesError': 'Leistungen konnten nicht geladen werden.',
  'admin.noServices': 'Noch keine Leistungen.',
  'admin.newService': 'Neue Leistung',
  'admin.editServiceLabel': '{name} bearbeiten',
  'admin.edit': 'Bearbeiten',
  'admin.editServiceTitle': 'Leistung bearbeiten',
  'admin.servicesKeepHint':
    'Änderungen gelten für neue Buchungen. Bereits gebuchte Termine behalten Leistung, Dauer und Preis.',
  'admin.fieldDescription': 'Beschreibung (optional)',
  'admin.fieldDescriptionHint':
    'Steht in der Preisliste auf der Website, in der jeweiligen Sprache.',
  'admin.fieldDurationHint': 'So lange ist der Kalender für diese Leistung belegt.',
  'admin.fieldActive': 'Online buchbar',
  'admin.fieldActiveHint':
    'Ausgeschaltet verschwindet die Leistung aus Preisliste und Buchung. Gebuchte Termine bleiben bestehen.',
  'admin.inactiveTag': 'Nicht online buchbar',
  'admin.cancelEdit': 'Abbrechen',
  'admin.priceError': 'Bitte einen Betrag wie 26 oder 26,50 eingeben.',
  'admin.name': 'Name',
  'admin.fieldNameDe': 'Name (Deutsch)',
  'admin.fieldNameIt': 'Name (Italienisch)',
  'admin.fieldDescriptionDe': 'Beschreibung (Deutsch, optional)',
  'admin.fieldDescriptionIt': 'Beschreibung (Italienisch, optional)',
  'admin.duration': 'Dauer',
  'admin.price': 'Preis',
  'admin.active': 'Aktiv',
  'admin.yes': 'Ja',
  'admin.no': 'Nein',
  'admin.minutes': '{minutes} Min',
  'admin.durationFrom': 'Dauer (von)',
  'admin.durationTo': 'Bis (Min., optional)',
  'admin.priceFrom': 'Preis (von)',
  'admin.priceTo': 'Bis (€, optional)',
  'admin.homepage': 'Startseite',
  'admin.homepageSubtitle':
    'Bereiche ein- oder ausblenden, Bilder verwalten und eigene Abschnitte hinzufügen.',
  'admin.homepageEditButton': 'Startseite bearbeiten',
  'admin.homepageSectionsTitle': 'Bereiche der Startseite',
  'admin.homepageSectionsHint': 'Blende Standardbereiche aus oder wieder ein.',
  'admin.homepageSectionHero': 'Kopfbereich (Intro)',
  'admin.homepageSectionServices': 'Leistungen & Preise',
  'admin.homepageSectionStyles': 'Styles / Galerie',
  'admin.homepageSectionStylists': 'Stylistinnen / Team',
  'admin.homepageSectionVisit': 'Öffnungszeiten & Kontakt',
  'admin.homepageGalleryTitle': 'Bilder (Styles / Galerie)',
  'admin.homepageGalleryHint': 'Lade neue Fotos hoch oder füge Bild-URLs hinzu.',
  'admin.homepageUploadImage': 'Bild hochladen',
  'admin.homepageUploading': 'Bild wird hochgeladen…',
  'admin.homepageImageUrl': 'Bild-URL',
  'admin.homepageImageAltDe': 'Beschreibung (Deutsch, optional)',
  'admin.homepageImageAltIt': 'Beschreibung (Italienisch, optional)',
  'admin.homepageAddImage': 'Bild hinzufügen',
  'admin.homepageRemoveImage': 'Bild entfernen',
  'admin.homepageResetGallery': 'Standardbilder wiederherstellen',
  'admin.homepageCustomSectionsTitle': 'Eigene Abschnitte',
  'admin.homepageAddSection': 'Abschnitt hinzufügen',
  'admin.homepageRemoveSection': 'Abschnitt entfernen',
  'admin.homepageSectionTitleDe': 'Titel (Deutsch)',
  'admin.homepageSectionTitleIt': 'Titel (Italienisch)',
  'admin.homepageSectionBodyDe': 'Text (Deutsch)',
  'admin.homepageSectionBodyIt': 'Text (Italienisch)',
  'admin.homepageSectionImage': 'Bild-URL (optional)',
  'home.carouselPrev': 'Vorherige Styles',
  'home.carouselNext': 'Nächste Styles',
  'admin.demoModeTitle': 'Demo-Modus',
  'admin.demoModeHint':
    'Füllt den Kalender mit Beispielterminen. Bestehende echte Termine bleiben erhalten.',
  'admin.demoModeSwitch': 'Demo-Termine im Kalender anzeigen',
  'admin.firstAdminTitle': 'Ersten Salon-Admin erstellen',
  'admin.firstAdminHint':
    'Erstellt das Hauptkonto für den Salon. Nur dieses Hauptkonto kann später Mitarbeiter-Konten anlegen.',
  'admin.firstAdminCreated': 'Erster Salon-Admin wurde erstellt.',
  'admin.firstAdminCreateButton': 'Salon-Admin erstellen',
  'admin.firstAdminAlreadyExists': 'Der erste Salon-Admin wurde bereits eingerichtet.',
  'admin.employeesTitle': 'Mitarbeiter-Konten',
  'admin.employeesHint':
    'Nur das Haupt-Admin-Konto kann neue Zugänge für Mitarbeiterinnen und Mitarbeiter erstellen.',
  'admin.employeeCreateButton': 'Mitarbeiter-Konto erstellen',
  'admin.employeeCreated': 'Mitarbeiter-Konto wurde erstellt.',
  'admin.primaryAdminBadge': 'Haupt-Admin',
  'admin.accountDisplayName': 'Name',
  'admin.accountEmail': 'E-Mail',
  'admin.accountPassword': 'Passwort (mind. 8 Zeichen)',
  'admin.settingsSubtitle': 'Regeln für Online-Buchungen und die Kontaktdaten auf der Website.',
  'admin.settingsLoading': 'Einstellungen laden',
  'admin.settingsError': 'Einstellungen konnten nicht geladen werden.',
  'admin.confirmationMode': 'Neue Buchungen',
  'admin.slotInterval': 'Raster für Startzeiten',
  'admin.minAdvance': 'Mindestvorlauf',
  'admin.maxAdvance': 'Höchstens im Voraus buchbar',
  'admin.pendingExpiration': 'Offene Anfragen verfallen nach',
  'admin.openingHours': 'Öffnungszeiten',
  'admin.openingHoursLoading': 'Laden…',
  'admin.openingHoursError': 'Öffnungszeiten konnten nicht geladen werden.',
  'admin.closed': 'Geschlossen',
  'hours.title': 'Öffnungszeiten & Abwesenheiten',
  'hours.subtitle':
    'Was du hier einträgst, sehen Kund:innen nur so: In geschlossenen Zeiten gibt es einfach keine freien Termine.',
  'hours.weeklyTitle': 'Jede Woche',
  'hours.weeklyHint':
    'Deine normalen Öffnungszeiten. Mit „Zeitraum“ planst du z. B. eine Mittagspause ein.',
  'hours.open': 'Geöffnet',
  'hours.from': 'Von',
  'hours.to': 'Bis',
  'hours.addInterval': 'Zeitraum',
  'hours.removeInterval': 'Zeitraum entfernen',
  'hours.copyToOpenDays': 'Auf alle geöffneten Tage übertragen',
  'hours.copied': 'Übertragen – noch speichern.',
  'hours.intervalOrder': 'Ende muss nach dem Beginn liegen.',
  'hours.intervalOverlap': 'Überschneidet sich mit einem anderen Zeitraum.',
  'hours.intervalInvalid': 'Bitte eine Uhrzeit eingeben.',
  'hours.unsaved': 'Nicht gespeicherte Änderungen',
  'hours.absencesTitle': 'Abwesenheiten & Ausnahmen',
  'hours.absencesHint':
    'Urlaub, Feiertag oder mal ein Vormittag zu – in diesen Zeiten kann niemand online buchen.',
  'hours.addAbsence': 'Abwesenheit eintragen',
  'hours.absencesEmpty': 'Keine geplanten Abwesenheiten.',
  'hours.absencesError': 'Abwesenheiten konnten nicht geladen werden.',
  'hours.kindQuestion': 'Was möchtest du eintragen?',
  'hours.kindDays': 'Ganze Tage',
  'hours.kindDaysHint': 'Urlaub, Feiertag, krank',
  'hours.kindMorning': 'Vormittag zu',
  'hours.kindMorningHint': 'Erst ab 12:00 geöffnet',
  'hours.kindAfternoon': 'Nachmittag zu',
  'hours.kindAfternoonHint': 'Nur bis 12:00 geöffnet',
  'hours.kindCustom': 'Andere Zeiten',
  'hours.kindCustomHint': 'Eigene Öffnungszeiten für einen Tag',
  'hours.firstDay': 'Erster Tag',
  'hours.lastDay': 'Letzter Tag',
  'hours.date': 'Datum',
  'hours.note': 'Notiz (optional)',
  'hours.notePlaceholder': 'z. B. Urlaub',
  'hours.defaultName': 'Geschlossen',
  'hours.dayCount': 'Tage: {count}',
  'hours.openThen': 'An diesem Tag geöffnet: {hours}',
  'hours.closedThen': 'An diesem Tag ist dann ganz geschlossen.',
  'hours.customHint': 'Öffnungszeiten nur für diesen Tag:',
  'hours.conflicts':
    'Bestehende Termine in dieser Zeit: {count}. Sie bleiben bestehen – bitte bei Bedarf selbst absagen.',
  'hours.dateRequired': 'Bitte ein Datum wählen.',
  'hours.endBeforeStart': 'Der letzte Tag liegt vor dem ersten.',
  'hours.tooLong': 'Höchstens ein Jahr am Stück.',
  'hours.checkIntervals': 'Bitte die Zeiten prüfen.',
  'hours.submitAbsence': 'Eintragen',
  'hours.dialogCancel': 'Abbrechen',
  'hours.deleteAbsence': 'Abwesenheit löschen',
  'hours.closedAllDay': 'Ganztags geschlossen',
  'hours.openOnly': 'Nur {hours} geöffnet',
  'admin.statPending': 'Offene Anfragen',
  'admin.pendingEmpty': 'Keine offenen Anfragen.',
  'admin.manageTitle': 'Verwaltung',
  'admin.addReservation': 'Termin eintragen',
  'admin.bookingRulesTitle': 'Online-Buchung',
  'admin.modeAutomatic': 'Automatisch bestätigen',
  'admin.modeAutomaticHint': 'Freie Termine sind sofort fest gebucht.',
  'admin.modeManual': 'Jede Anfrage selbst bestätigen',
  'admin.modeManualHint': 'Der Termin bleibt reserviert, bis Sie ihn bestätigen oder ablehnen.',
  'admin.slotIntervalHint': 'Alle wie viele Minuten ein Termin beginnen kann.',
  'admin.minAdvanceHint': 'So kurzfristig kann frühestens online gebucht werden.',
  'admin.maxAdvanceHint': 'So weit im Voraus zeigt der Buchungskalender freie Termine.',
  'admin.pendingExpirationHint': 'Gilt nur, wenn Sie Anfragen selbst bestätigen.',
  'admin.unitMinutes': 'Minuten',
  'admin.unitDays': 'Tage',
  'admin.unitHours': 'Stunden',
  'admin.salonDetailsTitle': 'Salon und Kontakt',
  'admin.salonDetailsHint': 'Erscheint auf der Startseite und im Fußbereich der Website.',
  'admin.fieldName': 'Name des Salons',
  'admin.fieldAddress': 'Adresse',
  'admin.fieldPhone': 'Telefon',
  'admin.fieldEmail': 'E-Mail',
  'admin.fieldVatId': 'MwSt.-Nr. (optional)',
  'admin.save': 'Speichern',
  'admin.saved': 'Gespeichert.',
  'admin.saveFailed': 'Speichern fehlgeschlagen: {message}',
  'admin.rangeError': 'Erlaubt sind ganze Zahlen von {min} bis {max}.',
  'admin.requiredError': 'Bitte ausfüllen.',
  'admin.emailError': 'Bitte eine gültige E-Mail-Adresse eingeben.',
  'admin.tooLongError': 'Höchstens {max} Zeichen.',
  'admin.backToDashboard': 'Zum Kalender',
  'admin.weekNumber': 'KW {week}',
  'admin.prevWeek': 'Vorherige Woche',
  'admin.nextWeek': 'Nächste Woche',
  'admin.thisWeek': 'Diese Woche',
  'admin.weekTotals': 'Summe der Woche',
  'admin.totalCount': 'Termine',
  'admin.totalTime': 'Gebuchte Zeit',
  'admin.totalRevenue': 'Umsatz',
  'admin.plannerLabel': 'Wochenkalender',
  'admin.plannerLegend': 'Legende',
  'admin.plannerAddAt': 'Termin eintragen am {date} um {time}',
  'admin.plannerAddHint': 'Freie Zeit anklicken, um einen Termin einzutragen.',
  'admin.plannerDayFree': 'Noch frei',
  'admin.plannerCount': '{count} Termine',
  'admin.plannerCountOne': '1 Termin',
}

export const it: Messages = {
  'nav.myBookings': 'I miei appuntamenti',
  'nav.staffCalendar': 'Calendario',
  'nav.staffSettings': 'Impostazioni',
  'nav.staffLogin': 'Accesso per il team',
  'nav.signedInAs': 'Accesso come {email}',
  'nav.main': 'Navigazione principale',
  'nav.signOut': 'Esci',
  'nav.language': 'Lingua',
  'nav.book': 'Prenota',
  'nav.home': 'KIMM Hair, vai alla home',

  'home.place': 'Parrucchiere a Merano',
  'home.intro':
    'Judith Lintner e il suo team tagliano, colorano e curano i capelli in Via Piave. Con tempo per i vostri desideri e prodotti delicati per capelli e cute.',
  'home.book': 'Prenota online',
  'home.call': 'Oppure chiamate: {phone}',
  'home.servicesTitle': 'Servizi e prezzi',
  'home.servicesHint': 'Scegliete un servizio per cercare subito un appuntamento.',
  'home.servicesError': 'Impossibile caricare il listino. Chiamateci pure.',
  'home.servicesEmpty': 'Stiamo aggiornando il listino. Chiamateci pure.',
  'home.hoursTitle': 'Orari di apertura',
  'home.hoursError': 'Impossibile caricare gli orari di apertura.',
  'home.closed': 'chiuso',
  'home.today': 'oggi',
  'home.visitTitle': 'Come trovarci',
  'home.stylistsTitle': 'Il team',
  'home.stylesTitle': 'Styles',
  'home.stylesHint': 'Tagli selezionati, tecniche balayage e colorazioni dal nostro salone.',
  'home.directions': 'Apri il percorso in Google Maps',
  'footer.vatId': 'P. IVA',

  'book.title': 'Prenota un appuntamento',
  'book.subtitle': 'Senza account — passo dopo passo fino all’orario desiderato.',
  'book.step.service': '1. Scegli il servizio',
  'book.step.date': '2. Scegli la data',
  'book.step.time': '3. Scegli l’orario',
  'book.step.details': '4. Dati di contatto',
  'book.step.confirm': '5. Conferma',
  'book.servicesLoading': 'Caricamento servizi…',
  'book.servicesError': 'Impossibile caricare i servizi.',
  'book.availabilityLoading': 'Caricamento disponibilità…',
  'book.availabilityError': 'Impossibile caricare la disponibilità.',
  'book.noSlotsMonth': 'Nessun appuntamento disponibile in questo periodo. Prova un altro mese.',
  'book.noSlotsDay': 'Nessun orario libero in questo giorno.',
  'book.monthPrev': 'Indietro',
  'book.monthNext': 'Avanti',
  'book.firstName': 'Nome',
  'book.lastName': 'Cognome',
  'book.phone': 'Telefono',
  'book.phoneHelp': 'es. 0660 1234567 — salvato in formato internazionale',
  'book.privacy': 'Ho preso visione dell’informativa sulla privacy.',
  'book.submit': 'Richiedi appuntamento',
  'book.submitting': 'Prenotazione in corso…',
  'book.otherTime': 'Altro orario',
  'book.durationMinutes': '{minutes} min',
  'book.weekday.mo': 'Lu',
  'book.weekday.tu': 'Ma',
  'book.weekday.we': 'Me',
  'book.weekday.th': 'Gi',
  'book.weekday.fr': 'Ve',
  'book.weekday.sa': 'Sa',
  'book.weekday.su': 'Do',
  'book.step1Title': 'Passo 1 di 2: Scegli i servizi',
  'book.step2Title': 'Passo 2 di 2: Data, orario e contatti',
  'book.continueToDate': 'Continua alla scelta della data',
  'book.backToServices': 'Torna ai servizi',
  'book.selectedServicesCount': '{count} selezionati',
  'book.totalDuration': 'Durata totale: {minutes} min',
  'book.totalPrice': 'Prezzo totale: {price}',
  'book.categoryOther': 'Altri servizi',
  'book.weekPrev': 'Settimana precedente',
  'book.weekNext': 'Settimana successiva',
  'book.expandCalendar': 'Espandi vista mensile',
  'book.collapseCalendar': 'Comprimi vista settimanale',
  'book.noSlotsWeek': 'Nessun appuntamento libero in questa settimana. Prova la prossima.',
  'book.email': 'Indirizzo e-mail',
  'book.notes': 'Note / desideri (opzionale)',
  'book.notesPlaceholder': 'Indicazioni o desideri per il parrucchiere…',
  'price.onRequest': 'Prezzo su richiesta',

  'confirmed.pendingTitle': 'Richiesta ricevuta',
  'confirmed.confirmedTitle': 'Appuntamento confermato',
  'confirmed.pendingBody':
    'Il salone sta esaminando la richiesta. Lo slot è riservato temporaneamente.',
  'confirmed.confirmedBody': 'Il tuo appuntamento è confermato — non vediamo l’ora di accoglierti!',
  'confirmed.emailSentNote':
    'Ti abbiamo inviato un’e-mail con tutti i dettagli, il link personale per gestire l’appuntamento e il file calendario (.ics).',
  'confirmed.saveWarning':
    'Salva questo link personale. Senza account è l’unico modo per gestire l’appuntamento. È stato salvato su questo dispositivo in “I miei appuntamenti”.',
  'confirmed.linkHeading': 'Il tuo link di gestione',
  'confirmed.manage': 'Gestisci appuntamento',
  'confirmed.copy': 'Copia link',
  'confirmed.share': 'Condividi',
  'confirmed.mailto': 'Invia via e-mail',
  'confirmed.myBookings': 'I miei appuntamenti',
  'confirmed.home': 'Torna alla home',
  'confirmed.copied': 'Link copiato negli appunti.',
  'confirmed.shared': 'Link condiviso.',
  'confirmed.shareTitle': 'Il mio appuntamento',
  'confirmed.shareText': 'Ecco il mio link personale per gestire l’appuntamento. Conservalo.',

  'myBookings.title': 'I miei appuntamenti',
  'myBookings.subtitle':
    'Link di gestione salvati su questo dispositivo. I dettagli vengono caricati in modo sicuro dal server.',
  'myBookings.empty':
    'Nessun appuntamento su questo dispositivo. Dopo una prenotazione il link compare qui automaticamente.',
  'myBookings.open': 'Apri appuntamento',
  'myBookings.copy': 'Copia link',
  'myBookings.share': 'Condividi',
  'myBookings.mailto': 'Invia via e-mail',
  'myBookings.remove': 'Rimuovi da questo dispositivo',
  'myBookings.bookNew': 'Prenota un nuovo appuntamento',
  'myBookings.home': 'Torna alla home',
  'myBookings.invalid':
    'Link non valido oppure appuntamento non più disponibile (scaduto, annullato o eliminato).',
  'myBookings.status': 'Stato: {status}',
  'myBookings.removed': 'Appuntamento rimosso da questo dispositivo.',
  'myBookings.copied': 'Link copiato.',
  'myBookings.copyFailed': 'Impossibile copiare.',
  'myBookings.shared': 'Link condiviso.',
  'myBookings.loading': 'Caricamento appuntamento',
  'myBookings.shareTitle': 'Il mio appuntamento',
  'myBookings.shareText': 'Ecco il mio link personale per gestire l’appuntamento.',

  'manage.title': 'Gestisci appuntamento',
  'manage.subtitle': 'Link personale — nessun login richiesto.',
  'manage.loading': 'Caricamento appuntamento',
  'manage.notFound': 'Appuntamento non trovato o link non valido.',
  'manage.status': 'Stato: {status}',
  'manage.reschedule': 'Riprogramma',
  'manage.cancelReschedule': 'Annulla',
  'manage.cancel': 'Cancella',
  'manage.cancelling': 'Cancellazione…',
  'manage.immutable': 'Questo appuntamento non può più essere modificato.',
  'manage.pickTime': 'Scegli un nuovo orario',
  'manage.slotsLoading': 'Caricamento orari',
  'manage.noAlternatives': 'Nessuna alternativa nei prossimi giorni.',
  'manage.home': 'Torna alla home',
  'manage.actionFailed': 'Operazione non riuscita',

  'status.PENDING': 'In attesa',
  'status.CONFIRMED': 'Confermato',
  'status.DECLINED': 'Rifiutato',
  'status.EXPIRED': 'Scaduto',
  'status.CANCELLED': 'Annullato',
  'status.COMPLETED': 'Completato',

  'login.title': 'Accesso admin',
  'login.email': 'E-mail',
  'login.password': 'Password',
  'login.submit': 'Accedi come admin',
  'login.submitting': 'Accesso in corso…',
  'login.hint': 'Locale dopo seed: admin@salonflow.local / password123',
  'login.staffOnly':
    'Solo per lo staff del salone. I clienti prenotano senza login — torna alla home.',
  'login.customerNote': 'I clienti prenotano senza login dalla home.',
  'login.failed': 'Accesso non riuscito',
  'login.backHome': 'Torna alla home clienti',

  'error.somethingWrong': 'Qualcosa è andato storto',
  'error.tryAgain': 'Riprova',

  'admin.title': 'Admin',
  'admin.calendar': 'Calendario',
  'admin.reservations': 'Appuntamenti',
  'admin.time': 'Orario',
  'admin.customer': 'Cliente',
  'admin.status': 'Stato',
  'admin.open': 'Apri',
  'admin.toCalendar': 'Vai al calendario',
  'admin.noReservations': 'Nessun appuntamento nel periodo.',
  'admin.reservationsError': 'Impossibile caricare gli appuntamenti.',
  'admin.services': 'Servizi',
  'admin.service': 'Servizio',
  'admin.settings': 'Impostazioni',
  'admin.maintenance': 'Manutenzione',
  'admin.maintenanceHint':
    'Controlla manualmente le richieste in attesa scadute (anche tramite pianificazione).',
  'admin.expirePending': 'Fai scadere le richieste in attesa',
  'admin.expireResult': 'Scadenza: {expired} di {scanned} richieste in attesa scadute.',
  'admin.loading': 'Caricamento…',
  'admin.signInRequired': 'Accesso richiesto.',
  'admin.forbidden': 'Area riservata agli amministratori del salone.',
  'admin.today': 'Oggi',
  'admin.allReservations': 'Tutti gli appuntamenti',
  'admin.calendarLoading': 'Caricamento calendario',
  'admin.detailTitle': 'Dettagli appuntamento',
  'admin.backToCalendar': 'Torna al calendario',
  'admin.detailLoading': 'Caricamento appuntamento',
  'admin.notFound': 'Appuntamento non trovato.',
  'admin.source': 'Origine: {source}',
  'admin.note': 'Nota: {note}',
  'admin.customerNotes': 'Note cliente: {notes}',
  'admin.confirm': 'Conferma',
  'admin.decline': 'Rifiuta',
  'admin.complete': 'Segna come completato',
  'admin.cancel': 'Annulla',
  'admin.manualTitle': 'Appuntamento manuale',
  'admin.manualSubtitle':
    'Per prenotazioni telefoniche — confermato subito. I limiti di anticipo non valgono.',
  'admin.back': 'Indietro',
  'admin.dayLabel': 'Giorno',
  'admin.noSlots': 'Nessuno slot libero.',
  'admin.emailOptional': 'E-mail (opzionale)',
  'admin.noteOptional': 'Nota interna (opzionale)',
  'admin.saving': 'Salvataggio…',
  'admin.createReservation': 'Crea appuntamento',
  'admin.servicesSubtitle': 'Listino per il sito e per gli appuntamenti inseriti da voi.',
  'admin.servicesLoading': 'Caricamento servizi',
  'admin.servicesError': 'Impossibile caricare i servizi.',
  'admin.noServices': 'Nessun servizio ancora.',
  'admin.newService': 'Nuovo servizio',
  'admin.editServiceLabel': 'Modifica {name}',
  'admin.edit': 'Modifica',
  'admin.editServiceTitle': 'Modifica servizio',
  'admin.servicesKeepHint':
    'Le modifiche valgono per le nuove prenotazioni. Gli appuntamenti già prenotati mantengono servizio, durata e prezzo.',
  'admin.fieldDescription': 'Descrizione (facoltativa)',
  'admin.fieldDescriptionHint': 'Appare nel listino prezzi sul sito, nella lingua corrispondente.',
  'admin.fieldDurationHint': 'Per questo tempo il calendario risulta occupato.',
  'admin.fieldActive': 'Prenotabile online',
  'admin.fieldActiveHint':
    'Se disattivato, il servizio sparisce dal listino e dalla prenotazione. Gli appuntamenti prenotati restano.',
  'admin.inactiveTag': 'Non prenotabile online',
  'admin.cancelEdit': 'Annulla',
  'admin.priceError': 'Inserite un importo come 26 o 26,50.',
  'admin.name': 'Nome',
  'admin.fieldNameDe': 'Nome (tedesco)',
  'admin.fieldNameIt': 'Nome (italiano)',
  'admin.fieldDescriptionDe': 'Descrizione (tedesco, facoltativa)',
  'admin.fieldDescriptionIt': 'Descrizione (italiano, facoltativa)',
  'admin.duration': 'Durata',
  'admin.price': 'Prezzo',
  'admin.active': 'Attivo',
  'admin.yes': 'Sì',
  'admin.no': 'No',
  'admin.minutes': '{minutes} min',
  'admin.durationFrom': 'Durata (da)',
  'admin.durationTo': 'Fino a (min, fac.)',
  'admin.priceFrom': 'Prezzo (da)',
  'admin.priceTo': 'Fino a (€, fac.)',
  'admin.homepage': 'Home page',
  'admin.homepageSubtitle':
    'Mostra o nascondi sezioni, gestisci le immagini e aggiungi sezioni personalizzate.',
  'admin.homepageEditButton': 'Modifica home',
  'admin.homepageSectionsTitle': 'Sezioni della home page',
  'admin.homepageSectionsHint': 'Nascondi o mostra nuovamente le sezioni predefinite.',
  'admin.homepageSectionHero': 'Intestazione (Intro)',
  'admin.homepageSectionServices': 'Servizi e prezzi',
  'admin.homepageSectionStyles': 'Styles / Galleria',
  'admin.homepageSectionStylists': 'Stiliste / Team',
  'admin.homepageSectionVisit': 'Orari e contatti',
  'admin.homepageGalleryTitle': 'Immagini (Styles / Galleria)',
  'admin.homepageGalleryHint': 'Carica nuove foto o aggiungi URL di immagini.',
  'admin.homepageUploadImage': 'Carica immagine',
  'admin.homepageUploading': 'Caricamento immagine…',
  'admin.homepageImageUrl': 'URL immagine',
  'admin.homepageImageAltDe': 'Descrizione (tedesco, fac.)',
  'admin.homepageImageAltIt': 'Descrizione (italiano, fac.)',
  'admin.homepageAddImage': 'Aggiungi immagine',
  'admin.homepageRemoveImage': 'Rimuovi immagine',
  'admin.homepageResetGallery': 'Ripristina immagini predefinite',
  'admin.homepageCustomSectionsTitle': 'Sezioni personalizzate',
  'admin.homepageAddSection': 'Aggiungi sezione',
  'admin.homepageRemoveSection': 'Rimuovi sezione',
  'admin.homepageSectionTitleDe': 'Titolo (tedesco)',
  'admin.homepageSectionTitleIt': 'Titolo (italiano)',
  'admin.homepageSectionBodyDe': 'Testo (tedesco)',
  'admin.homepageSectionBodyIt': 'Testo (italiano)',
  'admin.homepageSectionImage': 'URL immagine (facoltativo)',
  'home.carouselPrev': 'Stili precedenti',
  'home.carouselNext': 'Stili successivi',
  'admin.demoModeTitle': 'Modalità demo',
  'admin.demoModeHint':
    'Riempie il calendario con appuntamenti di esempio. Gli appuntamenti reali restano invariati.',
  'admin.demoModeSwitch': 'Mostra appuntamenti demo nel calendario',
  'admin.firstAdminTitle': 'Crea il primo amministratore del salone',
  'admin.firstAdminHint':
    'Crea l’account principale del salone. Solo questo account potrà creare nuovi account per i collaboratori.',
  'admin.firstAdminCreated': 'Primo amministratore del salone creato.',
  'admin.firstAdminCreateButton': 'Crea amministratore',
  'admin.firstAdminAlreadyExists': 'Il primo amministratore del salone è già stato configurato.',
  'admin.employeesTitle': 'Account collaboratori',
  'admin.employeesHint':
    'Solo l’amministratore principale può creare nuovi account per i collaboratori.',
  'admin.employeeCreateButton': 'Crea account collaboratore',
  'admin.employeeCreated': 'Account collaboratore creato.',
  'admin.primaryAdminBadge': 'Admin principale',
  'admin.accountDisplayName': 'Nome',
  'admin.accountEmail': 'E-mail',
  'admin.accountPassword': 'Password (min. 8 caratteri)',
  'admin.settingsSubtitle': 'Regole per le prenotazioni online e i contatti mostrati sul sito.',
  'admin.settingsLoading': 'Caricamento impostazioni',
  'admin.settingsError': 'Impossibile caricare le impostazioni.',
  'admin.confirmationMode': 'Nuove prenotazioni',
  'admin.slotInterval': 'Intervallo degli orari di inizio',
  'admin.minAdvance': 'Preavviso minimo',
  'admin.maxAdvance': 'Prenotabile al massimo con',
  'admin.pendingExpiration': 'Le richieste aperte scadono dopo',
  'admin.openingHours': 'Orari di apertura',
  'admin.openingHoursLoading': 'Caricamento…',
  'admin.openingHoursError': 'Impossibile caricare gli orari di apertura.',
  'admin.closed': 'Chiuso',
  'hours.title': 'Orari e assenze',
  'hours.subtitle':
    'I clienti non vedono nulla di tutto questo: negli orari di chiusura semplicemente non ci sono appuntamenti liberi.',
  'hours.weeklyTitle': 'Ogni settimana',
  'hours.weeklyHint': 'I tuoi orari normali. Con „Fascia“ puoi inserire ad es. una pausa pranzo.',
  'hours.open': 'Aperto',
  'hours.from': 'Dalle',
  'hours.to': 'Alle',
  'hours.addInterval': 'Fascia',
  'hours.removeInterval': 'Rimuovi fascia',
  'hours.copyToOpenDays': 'Applica a tutti i giorni aperti',
  'hours.copied': 'Applicato – ora salva.',
  'hours.intervalOrder': 'La fine deve essere dopo l’inizio.',
  'hours.intervalOverlap': 'Si sovrappone a un’altra fascia.',
  'hours.intervalInvalid': 'Inserisci un orario.',
  'hours.unsaved': 'Modifiche non salvate',
  'hours.absencesTitle': 'Assenze ed eccezioni',
  'hours.absencesHint':
    'Ferie, festività o una mattina chiusa – in questi orari nessuno può prenotare online.',
  'hours.addAbsence': 'Inserisci assenza',
  'hours.absencesEmpty': 'Nessuna assenza programmata.',
  'hours.absencesError': 'Impossibile caricare le assenze.',
  'hours.kindQuestion': 'Cosa vuoi inserire?',
  'hours.kindDays': 'Giorni interi',
  'hours.kindDaysHint': 'Ferie, festività, malattia',
  'hours.kindMorning': 'Mattina chiuso',
  'hours.kindMorningHint': 'Aperto solo dalle 12:00',
  'hours.kindAfternoon': 'Pomeriggio chiuso',
  'hours.kindAfternoonHint': 'Aperto solo fino alle 12:00',
  'hours.kindCustom': 'Altri orari',
  'hours.kindCustomHint': 'Orari speciali per un giorno',
  'hours.firstDay': 'Primo giorno',
  'hours.lastDay': 'Ultimo giorno',
  'hours.date': 'Data',
  'hours.note': 'Nota (facoltativa)',
  'hours.notePlaceholder': 'es. Ferie',
  'hours.defaultName': 'Chiuso',
  'hours.dayCount': 'Giorni: {count}',
  'hours.openThen': 'Aperto quel giorno: {hours}',
  'hours.closedThen': 'Quel giorno sarà chiuso tutto il giorno.',
  'hours.customHint': 'Orari solo per questo giorno:',
  'hours.conflicts':
    'Appuntamenti esistenti in questo periodo: {count}. Restano validi – se necessario annullali tu.',
  'hours.dateRequired': 'Scegli una data.',
  'hours.endBeforeStart': 'L’ultimo giorno è prima del primo.',
  'hours.tooLong': 'Al massimo un anno di seguito.',
  'hours.checkIntervals': 'Controlla gli orari.',
  'hours.submitAbsence': 'Inserisci',
  'hours.dialogCancel': 'Annulla',
  'hours.deleteAbsence': 'Elimina assenza',
  'hours.closedAllDay': 'Chiuso tutto il giorno',
  'hours.openOnly': 'Aperto solo {hours}',
  'admin.statPending': 'Richieste aperte',
  'admin.pendingEmpty': 'Nessuna richiesta aperta.',
  'admin.manageTitle': 'Gestione',
  'admin.addReservation': 'Inserisci appuntamento',
  'admin.bookingRulesTitle': 'Prenotazione online',
  'admin.modeAutomatic': 'Conferma automatica',
  'admin.modeAutomaticHint': 'Gli orari liberi vengono prenotati subito.',
  'admin.modeManual': 'Confermo ogni richiesta',
  'admin.modeManualHint': 'L’orario resta riservato finché non lo confermate o rifiutate.',
  'admin.slotIntervalHint': 'Ogni quanti minuti può iniziare un appuntamento.',
  'admin.minAdvanceHint': 'Con quanto anticipo minimo si può prenotare online.',
  'admin.maxAdvanceHint': 'Fin dove il calendario di prenotazione mostra orari liberi.',
  'admin.pendingExpirationHint': 'Vale solo se confermate voi le richieste.',
  'admin.unitMinutes': 'minuti',
  'admin.unitDays': 'giorni',
  'admin.unitHours': 'ore',
  'admin.salonDetailsTitle': 'Salone e contatti',
  'admin.salonDetailsHint': 'Compare nella home e nel piè di pagina del sito.',
  'admin.fieldName': 'Nome del salone',
  'admin.fieldAddress': 'Indirizzo',
  'admin.fieldPhone': 'Telefono',
  'admin.fieldEmail': 'E-mail',
  'admin.fieldVatId': 'P. IVA (facoltativa)',
  'admin.save': 'Salva',
  'admin.saved': 'Salvato.',
  'admin.saveFailed': 'Salvataggio non riuscito: {message}',
  'admin.rangeError': 'Sono ammessi numeri interi da {min} a {max}.',
  'admin.requiredError': 'Campo obbligatorio.',
  'admin.emailError': 'Inserite un indirizzo e-mail valido.',
  'admin.tooLongError': 'Al massimo {max} caratteri.',
  'admin.backToDashboard': 'Al calendario',
  'admin.weekNumber': 'Settimana {week}',
  'admin.prevWeek': 'Settimana precedente',
  'admin.nextWeek': 'Settimana successiva',
  'admin.thisWeek': 'Questa settimana',
  'admin.weekTotals': 'Totale della settimana',
  'admin.totalCount': 'Appuntamenti',
  'admin.totalTime': 'Tempo prenotato',
  'admin.totalRevenue': 'Fatturato',
  'admin.plannerLabel': 'Calendario settimanale',
  'admin.plannerLegend': 'Legenda',
  'admin.plannerAddAt': 'Inserisci appuntamento {date} alle {time}',
  'admin.plannerAddHint': 'Clicca su un orario libero per inserire un appuntamento.',
  'admin.plannerDayFree': 'Ancora libero',
  'admin.plannerCount': '{count} appuntamenti',
  'admin.plannerCountOne': '1 appuntamento',
}

export const catalogs: Record<'de' | 'it', Messages> = { de, it }

export function translate(
  locale: 'de' | 'it',
  key: MessageKey,
  vars?: Record<string, string | number>,
): string {
  let text: string = catalogs[locale][key] ?? catalogs.de[key] ?? key
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value))
    }
  }
  return text
}
