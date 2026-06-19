import * as XLSX from 'xlsx';

export interface ExcelRow {
  [key: string]: any;
}

/**
 * Parse Excel file
 */
export async function parseExcelFile(file: File): Promise<ExcelRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet);
        resolve(rows);
      } catch (error) {
        reject(new Error('Failed to parse Excel file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Validate Excel for student results
 * Expected columns: Student ID, Subject, Score
 */
export interface ResultRow {
  studentId: string;
  subject: string;
  score: number;
}

export function validateResultsExcel(rows: ExcelRow[]): {
  valid: boolean;
  data?: ResultRow[];
  errors: string[];
} {
  const errors: string[] = [];
  const data: ResultRow[] = [];

  // Check if rows exist
  if (!rows || rows.length === 0) {
    errors.push('Excel file is empty');
    return { valid: false, errors };
  }

  // Check for required columns
  const firstRow = rows[0];
  const requiredColumns = ['studentId', 'subject', 'score'];
  const hasAllColumns = requiredColumns.every((col) => col in firstRow);

  if (!hasAllColumns) {
    errors.push(
      `Missing required columns. Expected: ${requiredColumns.join(', ')}`
    );
    return { valid: false, errors };
  }

  // Validate each row
  rows.forEach((row, index) => {
    const rowNum = index + 2; // Account for header row

    if (!row.studentId) {
      errors.push(`Row ${rowNum}: Missing Student ID`);
      return;
    }

    if (!row.subject) {
      errors.push(`Row ${rowNum}: Missing Subject`);
      return;
    }

    const score = parseFloat(row.score);
    if (isNaN(score) || score < 0 || score > 100) {
      errors.push(`Row ${rowNum}: Invalid score (must be 0-100)`);
      return;
    }

    data.push({
      studentId: row.studentId,
      subject: row.subject,
      score,
    });
  });

  return {
    valid: errors.length === 0,
    data: errors.length === 0 ? data : undefined,
    errors,
  };
}

/**
 * Generate Excel template for results upload
 */
export function generateResultsTemplate(): Blob {
  const template = [
    {
      'Student ID': 'STD-001',
      Subject: 'Mathematics',
      Score: 85,
    },
    {
      'Student ID': 'STD-002',
      Subject: 'Mathematics',
      Score: 78,
    },
    {
      'Student ID': 'STD-003',
      Subject: 'Mathematics',
      Score: 92,
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');

  // Set column widths
  worksheet['!cols'] = [
    { wch: 15 },
    { wch: 20 },
    { wch: 10 },
  ];

  return XLSX.write(workbook, { bookType: 'xlsx', type: 'blob' }) as Blob;
}

/**
 * Export data to Excel
 */
export function exportToExcel<T>(
  data: T[],
  filename: string,
  sheetName = 'Data'
): void {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Export data to CSV
 */
export function exportToCSV<T>(
  data: T[],
  filename: string
): void {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const element = document.createElement('a');
  element.setAttribute(
    'href',
    `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
  );
  element.setAttribute('download', `${filename}.csv`);
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
