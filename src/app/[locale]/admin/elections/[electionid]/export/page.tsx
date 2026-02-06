"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Breadcrumb } from "@/components/admin";
import {
  mockExportToExcel,
  mockExportToCSV,
  type ExportDataType,
} from "@/actions/admin";

export default function ExportPage() {
  const params = useParams();
  const locale = useLocale();
  const electionId = params.electionid as string;

  const [exporting, setExporting] = useState<string | null>(null);

  const handleExportExcel = async (dataType: ExportDataType) => {
    setExporting(`excel-${dataType}`);
    try {
      const data = await mockExportToExcel(parseInt(electionId), dataType);
      // In real implementation, trigger download
      console.log("Excel export data:", data.substring(0, 100));
      alert(`Excel export completed for ${dataType}!`);
    } finally {
      setExporting(null);
    }
  };

  const handleExportCSV = async (dataType: ExportDataType) => {
    setExporting(`csv-${dataType}`);
    try {
      const data = await mockExportToCSV(parseInt(electionId), dataType);
      // In real implementation, trigger download
      console.log("CSV export data:", data);
      alert(`CSV export completed for ${dataType}!`);
    } finally {
      setExporting(null);
    }
  };

  const exportOptions = [
    {
      id: "parties",
      label: "Parties",
      description: "Export all party data including status and answers",
    },
    {
      id: "candidates",
      label: "Candidates",
      description: "Export all candidate data including profiles and answers",
    },
    {
      id: "answers",
      label: "Thesis Answers",
      description: "Export all thesis answers from parties and candidates",
    },
    {
      id: "all",
      label: "Complete Export",
      description: "Export all election data in one file",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb
          items={[
            { label: "Elections", href: `/${locale}/admin/elections` },
            {
              label: `#${electionId}`,
              href: `/${locale}/admin/elections/${electionId}`,
            },
            { label: "Export" },
          ]}
        />
        <h1 className="mt-2 text-2xl font-bold">Export Data</h1>
        <p className="text-muted-foreground">
          Export election data in various formats
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {exportOptions.map((option) => (
          <Card key={option.id}>
            <CardHeader>
              <CardTitle>{option.label}</CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleExportExcel(option.id)}
                disabled={exporting !== null}
              >
                {exporting === `excel-${option.id}` ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                )}
                Export Excel
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExportCSV(option.id)}
                disabled={exporting !== null}
              >
                {exporting === `csv-${option.id}` ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <FileText className="mr-2 h-4 w-4" />
                )}
                Export CSV
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Export History (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
          <CardDescription>
            Download previously generated exports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-muted-foreground">
            No previous exports found. Generate an export above.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
