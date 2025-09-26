"use client";

import React from "react";
import { parseAsString, useQueryState } from "nuqs";
import { AddFolderDialog } from "./add-folder-dialog";
import { BreadcrumbNavigation } from "./breadcrumb-navigation";
import { FileTable } from "./file-table";

interface FileItem {
  type: "file" | "folder";
  size?: number | string;
  children?: Record<string, FileItem>;
}

interface ExplorerItem {
  name: string;
  type: "file" | "folder";
  path: string;
  size?: number | string;
}

const mockData: Record<string, FileItem> = {
  "/": {
    type: "folder",
    children: {
      "Boldy James": {
        type: "folder",
        children: {
          "The Price of Tea in China": {
            type: "folder",
            children: {
              "Carruth.mp3": { type: "file", size: 4200000 },
              "Giant Slide.mp3": { type: "file", size: 3800000 },
              "Surf & Turf (feat. Vince Staples).mp3": { type: "file", size: 5100000 },
              "Run-Ins.mp3": { type: "file", size: 4500000 },
              "Scrape The Bowl (feat. Benny The Butcher).mp3": { type: "file", size: 4900000 },
              "Pinto.mp3": { type: "file", size: 3700000 },
              "Slow Roll.mp3": { type: "file", size: 4300000 },
              "S.N.O.R.T (feat. Freddie Gibbs).mp3": { type: "file", size: 5000000 },
              "Grey October (feat. Evidence).mp3": { type: "file", size: 4800000 },
              "Mustard.mp3": { type: "file", size: 3900000 },
              "Speed Demon Freestyle.mp3": { type: "file", size: 4600000 },
              "Phone Bill.mp3": { type: "file", size: 4400000 },
              "Pots & Pans (feat. Cool Kids & Shorty K).mp3": { type: "file", size: 5200000 },
              "Belvedere.mp3": { type: "file", size: 4100000 },
              "Bernadines.mp3": { type: "file", size: 4700000 },
              "Don Flamenco (feat. Elcamino).mp3": { type: "file", size: 4900000 },
            },
          },
          "Bo Jackson": {
            type: "folder",
            children: {
              "Double Hockey Sticks.mp3": { type: "file", size: 4500000 },
              "Brickmile to Montana.mp3": { type: "file", size: 4700000 },
              "E.P.M.D.mp3": { type: "file", size: 4300000 },
              "Steel Wool.mp3": { type: "file", size: 4200000 },
              "Photographic Memories.mp3": { type: "file", size: 5100000 },
              "Drug Zone.mp3": { type: "file", size: 4000000 },
            },
          },
        },
      },
      JPEGMAFIA: {
        type: "folder",
        children: {
          "All My Heroes Are Cornballs": {
            type: "folder",
            children: {
              "Jesus Forgive Me, I Am a Thot.mp3": { type: "file", size: 4200000 },
              "Kenan Vs. Kel.mp3": { type: "file", size: 3900000 },
              "Beta Male Strategies.mp3": { type: "file", size: 4300000 },
              "JPEGMAFIA TYPE BEAT.mp3": { type: "file", size: 4100000 },
              "Grimy Waifu.mp3": { type: "file", size: 4000000 },
              "PTSD.mp3": { type: "file", size: 4600000 },
              "Rap Grow Old & Die x No Child Left Behind.mp3": { type: "file", size: 4800000 },
              "All My Heroes Are Cornballs.mp3": { type: "file", size: 4400000 },
              "BBW.mp3": { type: "file", size: 4300000 },
              "PRONE!.mp3": { type: "file", size: 4100000 },
              "Lifes Hard, Here’s A Song About Sorrel.mp3": { type: "file", size: 4000000 },
              "Thot Tactics.mp3": { type: "file", size: 4200000 },
              "Free The Frail (feat. Helena Deland).mp3": { type: "file", size: 4700000 },
              "Post Verified Lifestyle.mp3": { type: "file", size: 3900000 },
              "BasicBitchTearGas.mp3": { type: "file", size: 4300000 },
              "DOTS FREESTYLE REMIX (feat. Buzzy Lee & Abdu Ali).mp3": { type: "file", size: 4500000 },
              "BUTTERMILK JESUS TYPE BEAT.mp3": { type: "file", size: 4200000 },
              "Papi I Missed U.mp3": { type: "file", size: 4100000 },
            },
          },
          Veteran: {
            type: "folder",
            children: {
              "1539 N. Calvert.mp3": { type: "file", size: 4300000 },
              "Real Nega.mp3": { type: "file", size: 4100000 },
              "Baby I'm Bleeding.mp3": { type: "file", size: 4400000 },
              "Thug Tears.mp3": { type: "file", size: 4000000 },
              "Rock N Roll Is Dead.mp3": { type: "file", size: 3900000 },
              "Panic Emoji.mp3": { type: "file", size: 4200000 },
              "Rainbow Six.mp3": { type: "file", size: 4500000 },
              "Curb Stomp.mp3": { type: "file", size: 4300000 },
              "I Cannot Fucking Wait Til Morrissey Dies.mp3": { type: "file", size: 4000000 },
            },
          },
        },
      },
      "Tyler, The Creator": {
        type: "folder",
        children: {
          IGOR: {
            type: "folder",
            children: {
              "Igor's Theme.mp3": { type: "file", size: 4800000 },
              "Earfquake.mp3": { type: "file", size: 5100000 },
              "I Think.mp3": { type: "file", size: 4600000 },
              "Exactly What You Run From You End Up Chasing.mp3": { type: "file", size: 4000000 },
              "Running Out of Time.mp3": { type: "file", size: 4500000 },
              "New Magic Wand.mp3": { type: "file", size: 4700000 },
              "A Boy Is a Gun*.mp3": { type: "file", size: 4300000 },
              "Puppet.mp3": { type: "file", size: 4200000 },
              "What's Good.mp3": { type: "file", size: 4400000 },
              "Gone, Gone / Thank You.mp3": { type: "file", size: 4900000 },
              "I Don't Love You Anymore.mp3": { type: "file", size: 4100000 },
              "Are We Still Friends?.mp3": { type: "file", size: 4800000 },
            },
          },
          "Call Me If You Get Lost": {
            type: "folder",
            children: {
              "SIR BAUDELAIRE.mp3": { type: "file", size: 4600000 },
              "CORSO.mp3": { type: "file", size: 4200000 },
              "LEMONHEAD (feat. 42 Dugg).mp3": { type: "file", size: 4400000 },
              "WUSYANAME (feat. Ty Dolla $ign & YoungBoy).mp3": { type: "file", size: 4300000 },
              "LUMBERJACK.mp3": { type: "file", size: 4100000 },
              "HOT WIND BLOWS (feat. Lil Wayne).mp3": { type: "file", size: 4500000 },
              "MASSA.mp3": { type: "file", size: 4700000 },
              "RUNITUP (feat. Teezo Touchdown).mp3": { type: "file", size: 4400000 },
              "MANIFESTO (feat. Domo Genesis).mp3": { type: "file", size: 4200000 },
            },
          },
        },
      },
      "Westside Gunn": {
        type: "folder",
        children: {
          Flygod: {
            type: "folder",
            children: {
              "Dunks (feat. Conway).mp3": { type: "file", size: 4300000 },
              "Gustavo (feat. Keisha Plum).mp3": { type: "file", size: 4000000 },
              "Shower Shoe Lords (feat. Benny).mp3": { type: "file", size: 4200000 },
              "Vivian at the Art Bassle (feat. Your Old Droog).mp3": { type: "file", size: 4100000 },
              "Hall.mp3": { type: "file", size: 3900000 },
              "Free Chapo (feat. Conway).mp3": { type: "file", size: 4400000 },
              "Over Gold (feat. Meyhem Lauren).mp3": { type: "file", size: 4500000 },
              "Bodies On Fairfax (feat. Danny Brown).mp3": { type: "file", size: 4700000 },
              "Chine Gun.mp3": { type: "file", size: 4000000 },
              "King City (feat. Mach Hommy).mp3": { type: "file", size: 4200000 },
              "Omar's Coming (feat. Conway & Roc Marciano).mp3": { type: "file", size: 4600000 },
              "Mr T.mp3": { type: "file", size: 3900000 },
              "50 Inch Zenith (feat. Skyzoo).mp3": { type: "file", size: 4300000 },
              "Sly Green Skit.mp3": { type: "file", size: 3500000 },
              "55 & A Half.mp3": { type: "file", size: 3700000 },
              "Albright Knox.mp3": { type: "file", size: 4100000 },
              "Dudley Boys (feat. Action Bronson).mp3": { type: "file", size: 4500000 },
              "Outro (feat. A.A. Rashid).mp3": { type: "file", size: 4200000 },
            },
          },
          "Pray for Paris": {
            type: "folder",
            children: {
              "400 Million Plus Tax.mp3": { type: "file", size: 4200000 },
              "No Vacancy.mp3": { type: "file", size: 4000000 },
              "George Bondo (feat. Conway & Benny).mp3": { type: "file", size: 4600000 },
              "327 (feat. Joey Badass, Tyler The Creator & Billie Essco).mp3": { type: "file", size: 4800000 },
              "French Toast (feat. Wale & Joyce Wrice).mp3": { type: "file", size: 4300000 },
              "Euro Step.mp3": { type: "file", size: 3900000 },
              "Allah Sent Me (feat. Benny & Conway).mp3": { type: "file", size: 4700000 },
              "500 Dollar Ounces (feat. Freddie Gibbs & Roc Marciano).mp3": { type: "file", size: 4900000 },
              "Ver$ace.mp3": { type: "file", size: 4100000 },
              "Claiborne Kick (feat. Boldy James).mp3": { type: "file", size: 4300000 },
              "Shawn vs Flair.mp3": { type: "file", size: 4000000 },
              "Party With Pop Smoke (feat. Keisha Plum).mp3": { type: "file", size: 4200000 },
              "Le Djoliba (feat. Cartier Williams).mp3": { type: "file", size: 3900000 },
            },
          },
          "Supreme Blientele": {
            type: "folder",
            children: {
              "GOD IS THE GREATEST.mp3": { type: "file", size: 4200000 },
              "Dean Malenko (feat. Benny).mp3": { type: "file", size: 4400000 },
              "Brains Flew By.mp3": { type: "file", size: 4000000 },
              "Brossface Brippler (feat. Benny & Busta Rhymes).mp3": { type: "file", size: 4700000 },
              "Elizabeth.mp3": { type: "file", size: 4300000 },
              "Wrestlemania 20.mp3": { type: "file", size: 4500000 },
              "Liza Love.mp3": { type: "file", size: 3900000 },
              "Sabu (feat. Robes).mp3": { type: "file", size: 4100000 },
            },
          },
        },
      },
    },
  },
};

function getItems(path: string): ExplorerItem[] {
  const parts = path.split("/").filter(Boolean);
  let current = mockData["/"];
  for (const part of parts) {
    if (current.children && current.children[part]) {
      current = current.children[part];
    } else {
      return [];
    }
  }
  if (current.type === "folder" && current.children) {
    return Object.entries(current.children).map(function ([name, item]: [string, FileItem]) {
      return {
        name,
        type: item.type,
        path: path === "/" ? `/${name}` : `${path}/${name}`,
        size: item.type === "file" ? item.size : undefined,
      };
    });
  }
  return [];
}

export function FileExplorer() {
  const [currentPath, setCurrentPath] = useQueryState(
    "path",
    parseAsString.withDefault("/").withOptions({ shallow: true }),
  );

  const items = React.useMemo(() => {
    return getItems(currentPath);
  }, [currentPath]);

  function navigateTo(newPath: string) {
    // Perform a shallow update of the `path` query param via nuqs
    if (newPath === currentPath) {
      return;
    }
    void setCurrentPath(newPath);
  }

  function handleDownload(filePath: string) {
    // Mock download
    if (!filePath) {
      return;
    }
    console.log("Downloading " + filePath);
  }

  function handleDelete(filePath: string) {
    // Mock delete
    if (!filePath) {
      return;
    }
    console.log("Deleting " + filePath);
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <BreadcrumbNavigation currentPath={currentPath} navigateTo={navigateTo} />
        <AddFolderDialog />
      </div>
      <FileTable items={items} navigateTo={navigateTo} handleDownload={handleDownload} handleDelete={handleDelete} />
    </div>
  );
}
