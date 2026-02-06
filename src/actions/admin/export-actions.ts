"use server";

import { simulateDelay } from "@/lib/admin/mock-utils";

export type ExportDataType = "parties" | "candidates" | "answers" | "all";

export async function mockExportToExcel(
  electionId: number,
  dataType: ExportDataType,
): Promise<string> {
  // Simulate longer processing for Excel generation
  await simulateDelay(1500);

  console.log(
    `Mock export to Excel: electionId=${electionId}, type=${dataType}`,
  );

  // Return a mock base64 string representing an Excel file
  // In real implementation, this would generate an actual Excel file
  const mockContent = `Election ${electionId} - ${dataType} export`;
  const base64Content = Buffer.from(mockContent).toString("base64");

  return `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64Content}`;
}

export async function mockExportToCSV(
  electionId: number,
  dataType: ExportDataType,
): Promise<string> {
  await simulateDelay(800);

  console.log(`Mock export to CSV: electionId=${electionId}, type=${dataType}`);

  // Generate mock CSV content
  let csvContent = "";

  switch (dataType) {
    case "parties":
      csvContent = `id,shortName,detailedName,status,color
1,CDU,Christlich Demokratische Union,active,#000000
2,SPD,Sozialdemokratische Partei Deutschlands,invited,#E3000F
3,Grüne,Bündnis 90/Die Grünen,voted,#46962B`;
      break;
    case "candidates":
      csvContent = `id,firstName,lastName,party,status,district
1,Max,Mustermann,CDU,active,Ulm-Nord
2,Maria,Musterfrau,SPD,invited,Ulm-Süd`;
      break;
    case "answers":
      csvContent = `thesisId,entityType,entityId,entityName,value,explanation
thesis-1,party,1,CDU,4,Wir unterstützen den Ausbau von Fahrradwegen.
thesis-1,party,3,Grüne,5,Höchste Priorität für nachhaltige Mobilität.
thesis-2,party,1,CDU,3,Mit Einschränkungen unterstützt.`;
      break;
    case "all":
      csvContent = `type,id,name,status
party,1,CDU,active
party,2,SPD,invited
candidate,1,Max Mustermann,active
candidate,2,Maria Musterfrau,invited`;
      break;
  }

  return csvContent;
}

export async function mockExportSurveyResults(
  electionId: number,
): Promise<string> {
  await simulateDelay(1000);

  console.log(`Mock export survey results: electionId=${electionId}`);

  const csvContent = `timestamp,surveyType,questionId,answer
2025-02-01T10:00:00Z,before,q1,yes
2025-02-01T10:05:00Z,before,q1,no
2025-02-01T11:00:00Z,after,q1,yes`;

  return csvContent;
}
