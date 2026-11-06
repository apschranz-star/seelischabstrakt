/*
 * Scheduled once a day: the recipe council reads new posts from the sources in
 * lib/ricette-web.mjs and keeps only what passes the gluten guardian, the lupus
 * sentinel and the plan keeper.
 *
 * Schedule: 04:17 UTC = 05:17 in Vienna and Rome in winter (CET), 06:17 in
 * summer (CEST). Scheduled functions only run on the published production
 * deploy and have 30 seconds, so the run stops reading after 22.
 */
import { getStore } from "@netlify/blobs";
import { eseguiGiro, STORE } from "../../lib/giro.mjs";

export default async () => {
  const giro = await eseguiGiro(getStore(STORE));
  console.log(`ricette-del-giorno: ${giro.lette} lette, ${giro.approvate} approvate, ${giro.adattate} adattate, ${giro.respinte} respinte in ${giro.durata_s} s`);
};

export const config = {
  schedule: "17 4 * * *",
};
