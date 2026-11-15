export type Messages = {
  'nav.myBookings': string
  'nav.admin': string
  'nav.signOut': string
  'nav.language': string

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

  'confirmed.pendingTitle': string
  'confirmed.confirmedTitle': string
  'confirmed.pendingBody': string
  'confirmed.confirmedBody': string
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
  'admin.day': string
  'admin.week': string
  'admin.today': string
  'admin.manualBooking': string
  'admin.allReservations': string
  'admin.calendarLoading': string
  'admin.anchorDate': string
  'admin.detailTitle': string
  'admin.backToCalendar': string
  'admin.detailLoading': string
  'admin.notFound': string
  'admin.source': string
  'admin.note': string
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
  'admin.name': string
  'admin.duration': string
  'admin.price': string
  'admin.active': string
  'admin.yes': string
  'admin.no': string
  'admin.minutes': string
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
  'admin.openingHoursEmpty': string
  'admin.closed': string
  'admin.holidays': string
  'admin.holidaysHint': string
}

export type MessageKey = keyof Messages

export const de: Messages = {
  'nav.myBookings': 'Meine Termine',
  'nav.admin': 'Admin',
  'nav.signOut': 'Abmelden',
  'nav.language': 'Sprache',

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

  'confirmed.pendingTitle': 'Anfrage eingegangen',
  'confirmed.confirmedTitle': 'Termin bestätigt',
  'confirmed.pendingBody': 'Der Salon prüft Ihre Anfrage. Der Zeitslot ist vorerst reserviert.',
  'confirmed.confirmedBody': 'Ihr Termin ist gebucht.',
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
  'admin.day': 'Tag',
  'admin.week': 'Woche',
  'admin.today': 'Heute',
  'admin.manualBooking': 'Manueller Termin',
  'admin.allReservations': 'Alle Termine',
  'admin.calendarLoading': 'Kalender laden',
  'admin.anchorDate': 'Ankerdatum: {date}',
  'admin.detailTitle': 'Termin-Details',
  'admin.backToCalendar': 'Zurück zum Kalender',
  'admin.detailLoading': 'Termin laden',
  'admin.notFound': 'Termin nicht gefunden.',
  'admin.source': 'Quelle: {source}',
  'admin.note': 'Notiz: {note}',
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
  'admin.servicesSubtitle':
    'Katalog für Online- und manuelle Buchungen. Preise als Ganzzahl in Cent.',
  'admin.servicesLoading': 'Leistungen laden',
  'admin.servicesError': 'Leistungen konnten nicht geladen werden.',
  'admin.noServices': 'Noch keine Leistungen.',
  'admin.name': 'Name',
  'admin.duration': 'Dauer',
  'admin.price': 'Preis',
  'admin.active': 'Aktiv',
  'admin.yes': 'Ja',
  'admin.no': 'Nein',
  'admin.minutes': '{minutes} Min',
  'admin.settingsSubtitle': 'Bestätigungsmodus und Vorlaufzeiten für den Pilot-Salon.',
  'admin.settingsLoading': 'Einstellungen laden',
  'admin.settingsError': 'Einstellungen konnten nicht geladen werden.',
  'admin.confirmationMode': 'Bestätigungsmodus: {mode}',
  'admin.slotInterval': 'Slot-Intervall: {minutes} Minuten',
  'admin.minAdvance': 'Mindestvorlauf: {minutes} Minuten',
  'admin.maxAdvance': 'Maximalvorlauf: {days} Tage',
  'admin.pendingExpiration': 'Ablauf ausstehend: {hours} Stunden',
  'admin.openingHours': 'Öffnungszeiten',
  'admin.openingHoursLoading': 'Laden…',
  'admin.openingHoursError': 'Öffnungszeiten konnten nicht geladen werden.',
  'admin.openingHoursEmpty': 'Keine Öffnungszeiten konfiguriert.',
  'admin.closed': 'Geschlossen',
  'admin.holidays': 'Feiertage',
  'admin.holidaysHint':
    'Feiertags-Editor folgt später; geseedete Feiertage beeinflussen bereits die Verfügbarkeit.',
}

export const it: Messages = {
  'nav.myBookings': 'I miei appuntamenti',
  'nav.admin': 'Admin',
  'nav.signOut': 'Esci',
  'nav.language': 'Lingua',

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

  'confirmed.pendingTitle': 'Richiesta ricevuta',
  'confirmed.confirmedTitle': 'Appuntamento confermato',
  'confirmed.pendingBody':
    'Il salone sta esaminando la richiesta. Lo slot è riservato temporaneamente.',
  'confirmed.confirmedBody': 'Il tuo appuntamento è prenotato.',
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
  'admin.day': 'Giorno',
  'admin.week': 'Settimana',
  'admin.today': 'Oggi',
  'admin.manualBooking': 'Appuntamento manuale',
  'admin.allReservations': 'Tutti gli appuntamenti',
  'admin.calendarLoading': 'Caricamento calendario',
  'admin.anchorDate': 'Data di riferimento: {date}',
  'admin.detailTitle': 'Dettagli appuntamento',
  'admin.backToCalendar': 'Torna al calendario',
  'admin.detailLoading': 'Caricamento appuntamento',
  'admin.notFound': 'Appuntamento non trovato.',
  'admin.source': 'Origine: {source}',
  'admin.note': 'Nota: {note}',
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
  'admin.servicesSubtitle':
    'Catalogo per prenotazioni online e manuali. Prezzi interi in centesimi.',
  'admin.servicesLoading': 'Caricamento servizi',
  'admin.servicesError': 'Impossibile caricare i servizi.',
  'admin.noServices': 'Nessun servizio ancora.',
  'admin.name': 'Nome',
  'admin.duration': 'Durata',
  'admin.price': 'Prezzo',
  'admin.active': 'Attivo',
  'admin.yes': 'Sì',
  'admin.no': 'No',
  'admin.minutes': '{minutes} min',
  'admin.settingsSubtitle': 'Modalità di conferma e limiti di anticipo per il salone pilota.',
  'admin.settingsLoading': 'Caricamento impostazioni',
  'admin.settingsError': 'Impossibile caricare le impostazioni.',
  'admin.confirmationMode': 'Modalità di conferma: {mode}',
  'admin.slotInterval': 'Intervallo slot: {minutes} minuti',
  'admin.minAdvance': 'Anticipo minimo: {minutes} minuti',
  'admin.maxAdvance': 'Anticipo massimo: {days} giorni',
  'admin.pendingExpiration': 'Scadenza in attesa: {hours} ore',
  'admin.openingHours': 'Orari di apertura',
  'admin.openingHoursLoading': 'Caricamento…',
  'admin.openingHoursError': 'Impossibile caricare gli orari di apertura.',
  'admin.openingHoursEmpty': 'Nessun orario di apertura configurato.',
  'admin.closed': 'Chiuso',
  'admin.holidays': 'Festività',
  'admin.holidaysHint':
    'L’editor festività arriverà più avanti; le festività seed influenzano già la disponibilità.',
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
