import { reportRepository } from './report-repository.js';

class ReportService {
  async getSalesSummary(fromDate, toDate) {
    return reportRepository.getSalesSummary(fromDate, toDate);
  }

  async getPurchaseSummary(fromDate, toDate) {
    return reportRepository.getPurchaseSummary(fromDate, toDate);
  }

  async getStockSummary() {
    return reportRepository.getStockSummary();
  }

  async getTopProducts(limit) {
    return reportRepository.getTopProducts(limit);
  }
}

export { ReportService };
export const reportService = new ReportService();
