# Cortex — Memoria semantica per agenti AI

> Un cervello esterno, model-agnostic, in produzione. Collegalo a Claude in due minuti — prova gratuita, senza carta di credito.

**Cortex** è un'infrastruttura di memoria semantica protetta da brevetto, sviluppata da [SKYNETLAB](https://skynetlab.net/) (Bergamo). Collegato al tuo assistente AI come connettore MCP remoto, permette alle tue conversazioni di **salvare decisioni, contesto e fonti — e di ritrovarli in ogni sessione successiva**. La tua AI ricorda, e può mostrare *perché* ricorda.

🌐 Sito: [skynetlab-cortex.com](https://skynetlab-cortex.com/) · 📄 [Brevetto](https://skynetlab-cortex.com/brevetto) · 📊 [Benchmark](https://skynetlab-cortex.com/benchmark) · 📚 [Paper](https://skynetlab-cortex.com/paper) · 💶 [Abbonamenti](https://skynetlab-cortex.com/abbonamenti)

> 🇬🇧 English version: [README.md](README.md)

---

## Perché Cortex non è "l'ennesimo plugin di memoria"

La maggior parte dei tool di memoria registra ciò che l'agente ha fatto e recupera testo simile. Cortex modella **cosa è vero e quanto è affidabile**:

| Capacità | Cosa significa |
|---|---|
| **Quality Gate in scrittura** | Ogni memoria passa un controllo di novità/ridondanza prima di essere salvata. |
| **Claims tipizzati e conflitti** | I fatti sono estratti come claims; le contraddizioni tra memorie vengono rilevate e tracciate, non sovrascritte in silenzio. |
| **Knowledge graph** | Le memorie sono collegate da entità e relazioni tipizzate, non solo da similarità vettoriale. |
| **Metrica di coerenza (Ψ_C)** | Ogni memoria ha un punteggio di coerenza nativo rispetto a ciò che il sistema già sa. |
| **Consolidamento ("REM")** | Un ciclo continuo in background consolida le memorie episodiche in conoscenza a lungo termine. |
| **Evidenza trasparente** | Le risposte possono citare le memorie e le fonti da cui provengono. |

Cortex gira su infrastruttura edge distribuita operata nell'**Unione Europea**. Il motore di memoria è coperto dalla domanda di brevetto italiana **UIBM 102026000014026** (deposito 15/05/2026).

## Avvio rapido — Claude (web / desktop / mobile)

Requisiti: un piano Claude che supporta i connettori personalizzati (la voce "Connettori" compare nelle impostazioni). L'account Cortex non va creato prima: nasce al primo accesso.

1. In Claude apri **Impostazioni → Connettori → Aggiungi connettore personalizzato**
2. Incolla questo indirizzo e conferma:

   ```
   https://skynetlab-cortex-saas-mcp.cortex-320.workers.dev/mcp
   ```

3. Autorizza l'accesso sulla pagina di consenso di Cortex (Google o email). Il tuo spazio memoria personale viene creato automaticamente, isolato da quello di ogni altro utente.

Fatto. Parla con Claude come sempre: *"Ricorda che abbiamo scelto il fornitore X"*, *"cosa avevamo deciso sul budget?"*, *"mostrami le fonti di questa affermazione"*.

## Avvio rapido — Claude Code

```bash
claude mcp add --transport http cortex https://skynetlab-cortex-saas-mcp.cortex-320.workers.dev/mcp
```

Poi autentica quando richiesto (`/mcp` mostra lo stato della connessione).

## Avvio rapido — altri client MCP (bridge stdio)

Per i client MCP che non supportano i connettori remoti nativamente, usa il bridge [`mcp-remote`](https://www.npmjs.com/package/mcp-remote). Esempio di configurazione nella cartella [`examples/`](examples/).

## I sei strumenti

| Strumento | Tipo | Descrizione |
|---|---|---|
| **Search memories** | lettura | Ricerca semantica nelle tue memorie |
| **Fetch memory** | lettura | Dettaglio completo di una memoria, con le sue fonti |
| **Recall & synthesize** | lettura | Sintesi narrativa di ciò che Cortex sa su un tema |
| **Show conflicts** | lettura | Contraddizioni tracciate tra memorie |
| **Save memory** | scrittura | Salva una memoria — dopo un controllo qualità contro duplicati e ridondanza |
| **Forget memory** | distruttivo | Cancella una memoria — sempre con conferma esplicita |

## Dati e privacy

Le memorie sono personali: ogni utente vede solo le proprie. Sono esportabili e cancellabili su richiesta, e l'infrastruttura opera nell'Unione Europea. Dettagli: [Privacy Policy](https://skynetlab-cortex.com/privacy).

Per scollegare Cortex basta rimuovere il connettore dalle impostazioni del client; le memorie restano nel tuo account finché non ne chiedi la cancellazione.

## È open source?

Il motore di memoria Cortex è un **servizio hosted protetto da brevetto** — il suo codice sorgente non è pubblicato. Questo repository contiene la documentazione pubblica e gli esempi di configurazione lato client. Tutto ciò che è in questo repository è rilasciato con [licenza MIT](LICENSE).

## Supporto

📧 info@skynetlab.net · [Pagina contatti](https://skynetlab-cortex.com/contatti)

---

*Cortex è un prodotto [SKYNETLAB](https://skynetlab.net/) — laboratorio di ricerca indipendente e deeptech, Bergamo. Fondatore: Filippo Pilotta ([ORCID 0009-0000-5002-4199](https://orcid.org/0009-0000-5002-4199)).*

*Alcuni contenuti e gli output dei prodotti sono generati o assistiti da intelligenza artificiale, ai sensi dell'art. 50 del Reg. (UE) 2024/1689. [Trasparenza AI](https://skynetlab-cortex.com/trasparenza-ai).*
