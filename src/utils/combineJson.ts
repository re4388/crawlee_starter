import * as fs from "fs";

async function main() {
  const FILE_COUNT = 1000;
  let allData = await readFilesIntoMemory(FILE_COUNT);
  allData = postProcess(allData);
  //   console.log("allData", allData);
  //   saveIntoOneJSONFile(allData);
  SimpleSaveIntoFile(allData);
}

main();

// run it
// ts-node-esm src/utils/combineJson.ts;

/////////////////////////// util /////////////////////////////

function postProcess(allData: any) {
  // 2. some post process
  allData.sort((a: any, b: any) => {
    const a1 = a.commentCount;
    const b1 = b.commentCount;
    return b1 - a1;
  });

  allData = convertToCSV(allData);

  return allData;
}

function convertToCSV(arr: any) {
  const array = [Object.keys(arr[0])].concat(arr);

  return array
    .map((it) => {
      return Object.values(it).toString();
    })
    .join("\n");
}

/**
 * @param allData
 * save all data from memory into one file
 */
function saveIntoOneJSONFile(allData: any) {
  fs.writeFile("./allData.json", JSON.stringify(allData), (err) => {
    if (err) throw err;
    console.log("Data written to file");
  });
}

function SimpleSaveIntoFile(allData: any) {
  fs.writeFileSync("./savedFile.txt", allData);
}

async function readFilesIntoMemory(fileCount: number) {
  const allData: any = [];
  let fileNameList = getFileNameList(fileCount);
  //   console.log("fileNameList", fileNameList);
  for (let i = 0; i < fileNameList.length; i++) {
    let filePath = `/Users/re4388/project/personal/starter-pjt/my-crawler2/storage/datasets/default/${fileNameList[i]}.json`;
    try {
      let data = await fs.promises.readFile(filePath, "utf8");
      let jsonObject: any = JSON.parse(data);
      allData.push(jsonObject);
    } catch (err) {
      console.error(err);
    }
  }

  return allData;
}

function getFileNameList(fileCount: number): string[] {
  const fileNameList: string[] = [];
  for (let i = 1; i <= fileCount; i++) {
    let fileName = i.toString();

    while (fileName.length < 9) {
      fileName = "0" + fileName;
    }
    fileNameList.push(fileName);
  }
  return fileNameList;
}
