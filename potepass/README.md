# Arbeidskrav_Potepass
Potepass er en digital tjeneste som har som formål å forenkle prosessen med å finne og booke hundepass. Løsningen tar utgangspunkt i to hovedroller: hundeeier og hundepasser. Hundeeier er primærbruker av tjenesten og benytter løsningen til å registrere seg, finne hundepassere og sende bookingforespørsler.
Hundepassere presenteres som egne ressurser i systemet, med informasjon om tilgjengelighet, erfaring og pris, og kan bookes av hundeeiere gjennom løsningen. 

-------------------------------

Student: Fredrik
Side: Profil

API:
•	Users and dogs
•	Reviews
•	Bookings

Innhold
•	Vise innlogget brukers profilinformasjon
•	Vise liste over brukerens hunder
•	Skjema for redigering av brukerdata
•	Skjema for administrasjon av hunder
•	Sletting av bruker og hunder
•	Antall bookinger 

CRUD
Create: Opprette ny hund (legges til i dogs[])
Read: Hente og vise brukerdata + hunder
Update: Redigere brukerprofil og redigere eksisterende hund
Delete: Slette hund fra bruker, slette brukerprofil

Reserve: Stine

-------------------------------

Student: Stine
Side: Hundepassere

API:
•	petSitters
•	Users
•	Bookings
•	Reviews

Innhold:
•	Listevisning av alle hundepassere
•	Filtrering på sted, pris, tilgjengelighet og erfaring
•	Drop-down for detaljer om passer
•	Registrere hundepasser

CRUD:
Create: Registrere seg som hundepasser
Read: Hente og vise alle hundepassere.
Vise detaljer om én hundepasser
Update: Redigere informasjon om deg som hundepasser 
Delete: Slette deg som hundepasser

Reserve: Anette

-------------------------------

Student: Anette
Side: Opprette booking

API:
•	Bookings
•	Users
•	petSitters

Innhold:
•	Skjema for å opprette booking
•	Velge hund
•	Velge hundepasser
•	Velge datoer
•	Sende melding
•	Endre og slette booking

CRUD:
Create: Opprette ny booking (POST)
Read: Hente tilgjengelige hundepassere.
Hente brukerens hunder
Update: Endre booking før den er bekreftet (dato/melding)
Delete: Avbryte/slette booking

Reserve: Karlla

-------------------------------

Student: Karlla
Side: Status booking

API:
•	Bookings
•	Reviews (legges til API)
•	Users
•	petSitters

Innhold:
•	Liste over alle brukerens bookinger
•	Status (pending / accepted / rejected)
•	Detaljvisning av booking
•	Fjerne booking
•	Gi anmeldelse til brukere

CRUD:
Create: Opprette reviews på hundepassere
Read: Hente og vise alle bookinger for bruker
Update: Oppdatere status.
Endre melding/dato.
Delete: Slette booking

Reserve: Fredrik
