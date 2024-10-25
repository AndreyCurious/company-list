import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Company } from "../fakeApi/fakeApi";

export interface CompanyFront extends Company {
  isSelected: boolean;
}

interface CompanyState {
  companies: CompanyFront[];
  limit: number;
  skipCount: number;
  totalCount: number;
}

const initialState: CompanyState = {
  companies: [],
  limit: 10,
  skipCount: 0,
  totalCount: 0,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompanies: (state, action: PayloadAction<CompanyFront[]>) => {
      state.companies = action.payload;
    },
    toggleSelect: (state, action: PayloadAction<number>) => {
      const company = state.companies.find((c) => c.id === action.payload);
      if (company) {
        company.isSelected = !company.isSelected;
      }
    },
    toggleSelectAll: (state, action: PayloadAction<boolean>) => {
      state.companies.forEach((company) => {
        company.isSelected = action.payload;
      });
    },
    addCompany: (state, action: PayloadAction<CompanyFront>) => {
      state.companies.unshift(action.payload);
    },
    removeSelected: (state) => {
      state.companies = state.companies.filter(
        (company) => !company.isSelected
      );
    },
    setlimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setSkipCount: (state, action: PayloadAction<number>) => {
      state.skipCount = action.payload;
    },
    setTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
  },
});

export const {
  setCompanies,
  toggleSelect,
  toggleSelectAll,
  addCompany,
  removeSelected,
  setlimit,
  setSkipCount,
  setTotalCount,
} = companySlice.actions;
export default companySlice.reducer;
