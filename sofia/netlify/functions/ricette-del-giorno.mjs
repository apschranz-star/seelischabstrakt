/*
 * Scheduled once a day: the recipe council reads new posts from the sources in
 * lib/ricette-web.mjs and keeps only what passes the gluten guardian, the lupus
 * sentinel and the plan keeper.
 *
 * Schedule: 04:17 UTC = 05:17 in Vienna and Rome in winter (CET), 06:17 in
 * summer (CEST). Scheduled functions only run on the published production
 * deploy and have 30 seconds, so the run stops reading after 22. First the
 * food lookup cache drops answers older than 7 days (data minimisation), on
 * its own and with at most 3 seconds, so a failing recipe run never skips it.
 */
import { getStore } from "@netlify/blobs";
import { eseguiGiro, STORE } from "../../lib/giro.mjs";
import { ripulisciCache, CACHE_STORE } from "../../lib/off.mjs";

export default async () => {
  try {
    const tolti = await Promise.race([ripulisciCache(getStore(CACHE_STORE)), new Promise((_, no) => setTimeout(() => no(new Error("oltre 3 s")), 3000))]);
    console.log(`ricette-del-giorno: cache alimenti, ${tolti} risposte vecchie cancellate`);
  } catch (e) {
    console.log("ricette-del-giorno: cache alimenti non ripulita: " + e.message);
  }
  const giro = await eseguiGiro(getStore(STORE));
  console.log(`ricette-del-giorno: ${giro.lette} lette, ${giro.approvate} approvate, ${giro.adattate} adattate, ${giro.respinte} respinte in ${giro.durata_s} s`);
};

export const config = {
  schedule: "17 4 * * *",
};
