# Lumière Kerzen Shop – Setup Anleitung

## Dateistruktur

```
kerzen-shop/
├── index.html          ← Hauptseite mit allen Produkten
├── ueber-uns.html      ← Über uns Seite
├── kontakt.html        ← Kontaktformular
├── datenschutz.html    ← Datenschutzerklärung
├── agb.html            ← Allgemeine Geschäftsbedingungen
├── style.css           ← Alle Styles
└── img/                ← Ordner für deine Bilder (selbst erstellen)
    ├── hero.jpg
    ├── ueber-uns.jpg
    ├── kerze-lavendel.jpg
    ├── kerze-zedernholz.jpg
    ├── kerze-rose.jpg
    ├── kerze-eukalyptus.jpg
    ├── kerze-zimt.jpg
    ├── kerze-jasmin.jpg
    ├── kerze-vanille.jpg
    ├── kerze-orange.jpg
    ├── kerze-kiefernnadel.jpg
    └── kerze-geschenkset.jpg
```

---

## Schritt 1: GitHub Repository erstellen

1. Gehe auf github.com und erstelle ein neues Repository
2. Name: `lumiere-shop` (oder beliebig)
3. Auf **Public** stellen
4. Alle Dateien hochladen (oder via Git pushen)
5. Im Repo → **Settings** → **Pages** → Source: `main` branch → **Save**
6. Deine Seite ist dann unter `https://DEINUSERNAME.github.io/lumiere-shop/` erreichbar

---

## Schritt 2: Snipcart einrichten

1. Konto erstellen auf **snipcart.com** (kostenlos, Zahlungen erst bei echten Verkäufen)
2. Im Dashboard: **API Keys** kopieren
3. In **allen HTML-Dateien** ersetzen:
   ```
   DEIN_SNIPCART_API_KEY_HIER  →  dein echter Public API Key
   ```
4. In Snipcart-Dashboard unter **Payment** → **Mollie** auswählen

---

## Schritt 3: Mollie einrichten (für Twint)

1. Konto erstellen auf **mollie.com** (kostenlos, keine Grundgebühr)
2. Schweizer Geschäftskonto verknüpfen (Pflicht für Twint)
3. Unter **Payment methods** → **Twint** aktivieren
4. API Key aus Mollie in Snipcart-Dashboard eingeben

---

## Schritt 4: Bilder ersetzen

Erstelle einen Ordner `img/` und füge deine eigenen Fotos ein.

**Empfohlene Bildgrösse:**
- Produktbilder: 800 × 800 px (quadratisch oder hochformat)
- Hero-Bild: 1200 × 900 px
- Über-uns-Bild: 1600 × 600 px

Bilder komprimieren (z.B. auf squoosh.app) damit die Seite schnell lädt.

---

## Schritt 5: Inhalte anpassen

### Produkte ändern (in index.html)
Jedes Produkt hat diese Felder zum Anpassen:
```html
data-item-id="EINDEUTIGE-ID"
data-item-name="PRODUKTNAME"
data-item-price="PREIS"
data-item-description="BESCHREIBUNG"
data-item-image="img/BILD.jpg"
```

### Shop-Name ändern
Ersetze überall `Lumière` durch deinen eigenen Shopnamen.

### E-Mail ändern
Ersetze `hallo@lumiere-kerzen.ch` in kontakt.html, datenschutz.html und agb.html.

### Kontaktformular
Das Formular nutzt Formspree (formspree.io) – kostenlos bis 50 Anfragen/Monat.
1. Konto auf formspree.io erstellen
2. Formular-ID erhalten und in kontakt.html einsetzen:
   ```
   DEINE_FORMSPREE_ID  →  z.B. xpwzgkjv
   ```

---

## Schritt 6: Rechtliche Angaben vervollständigen

In `datenschutz.html` und `agb.html` ersetzen:
- `[DEIN NAME]` → Vor- und Nachname
- `[DEINE ADRESSE]` → Strasse und Hausnummer
- `[PLZ ORT]` → Postleitzahl und Ort

---

## Kosten im Überblick

| Dienst       | Kosten                              |
|--------------|-------------------------------------|
| GitHub Pages | Kostenlos                           |
| Snipcart     | 2% pro Transaktion                  |
| Mollie       | ~1–1.4% + CHF 0.25 pro Zahlung      |
| Formspree    | Kostenlos bis 50 Anfragen/Monat     |
| Domain .ch   | ~CHF 15–25 / Jahr (optional)        |

---

## Eigene Domain einrichten (optional)

Falls du eine eigene Domain willst (z.B. lumiere-kerzen.ch):
1. Domain kaufen bei Infomaniak, Namecheap oder Hostpoint
2. Im Domain-DNS einen CNAME-Eintrag setzen auf `DEINUSERNAME.github.io`
3. In GitHub Pages Settings → Custom domain eintragen
4. HTTPS aktivieren (Checkbox in GitHub Pages Settings)
