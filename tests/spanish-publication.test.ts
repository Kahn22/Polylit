import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createSpanishLearningBundle } from "../src/content/linguistic/spanish.js";
import { vocabularyIdentityKey } from "../src/domain/model.js";
import { validateContentBundle } from "../src/domain/validate.js";

const digest=(text:string)=>createHash("sha256").update(text).digest("hex");

describe("historical Spanish preparation fixture (structural checks, not editorial approval)",()=>{
  const bundle=createSpanishLearningBundle();

  it("pins the reviewed public-domain source texts",()=>{
    expect(digest(bundle.sources.find(x=>x.workId==="wrk_palma_camisa_margarita")!.canonicalText)).toBe("b6114ff5456b3057a3e24140974309c4911c7731b6a9305433ebc17393b6ec2a");
    expect(digest(bundle.sources.find(x=>x.workId==="wrk_quiroga_almohadon_plumas")!.canonicalText)).toBe("17a5ee8aa5c1456e8584b1ac65452318241718f53a09e301e21a1dbdcba1c8f1");
  });

  it("retains origin metadata and three mechanically complete quiz bands",()=>{
    expect(validateContentBundle(bundle)).toEqual({ok:true,diagnostics:[]});
    expect(bundle.readiness.every(x=>x.thoughtUnitsComplete&&x.occurrencesReviewed&&!x.unresolvedLearnerTokens.length)).toBe(true);
    expect(bundle.works.map(x=>[x.originCountryFlag,x.originCountryName])).toEqual([["🇵🇪","Peru"],["🇺🇾","Uruguay"]]);
    const identities=new Set(bundle.occurrences.map(x=>vocabularyIdentityKey(x.surfaceFormId,x.senseId)));
    expect(bundle.quizItems).toHaveLength(identities.size*3);
    expect([...identities].every(identity=>bundle.quizItems.filter(item=>vocabularyIdentityKey(item.surfaceFormId,item.senseId)===identity).length===3)).toBe(true);
  });
});
