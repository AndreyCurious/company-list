import React, { createRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/index";
import {
  setCompanies,
  toggleSelect,
  toggleSelectAll,
  addCompany,
  removeSelected,
  setTotalCount,
  setSkipCount,
} from "../store/companySlice";
import fetchCompanies from "../fakeApi/fakeApi";

const CompanyTable: React.FC = () => {
  const dispatch = useDispatch();
  const companies = useSelector((state: RootState) => state.company.companies);
  const skipCount = useSelector((state: RootState) => state.company.skipCount);
  const limit = useSelector((state: RootState) => state.company.limit);
  const totalCount = useSelector(
    (state: RootState) => state.company.totalCount
  );

  const [checkedAll, setChekedAll] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const inputRef = createRef<HTMLInputElement>();
  const endlessScrollref = createRef<HTMLDivElement>();

  async function loadContent(limit: number, skipCount: number) {
    // с бэка нам приходит без isSelected
    // как правило, с бека мы можем получить заголовок x-total-count
    setLoading(true);
    const { collection, xTotalCount } = await fetchCompanies(limit, skipCount);
    dispatch(setTotalCount(xTotalCount));
    const newCompanies = collection.map((company) => {
      return { ...company, isSelected: false };
    });

    dispatch(setCompanies([...companies, ...newCompanies]));
    dispatch(setSkipCount(skipCount + limit));
    setLoading(false);
  }

  useEffect(() => {
    const isSomeNotSelect = companies.some(
      (company) => company.isSelected === false
    );
    isSomeNotSelect ? setChekedAll(false) : setChekedAll(true);
  }, [companies]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && skipCount <= totalCount) {
        loadContent(limit, skipCount);
      }
    });
    observer.observe(endlessScrollref.current as Element);
    return () => {
      observer.disconnect();
    };
  });

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChekedAll(true);
    dispatch(toggleSelectAll(event.target.checked));
  };

  const handleSelect = (id: number) => {
    dispatch(toggleSelect(id));
  };

  const handleRemoveSelected = () => {
    setChekedAll(false);
    dispatch(removeSelected());
  };

  const handleAddCompany = () => {
    const newCompany = {
      id: Date.now(),
      name: "",
      address: "",
      isSelected: false,
    };
    dispatch(addCompany(newCompany));
  };

  const handleEdit = (id: number, field: "name" | "address", value: string) => {
    dispatch(
      setCompanies(
        companies.map((company) =>
          company.id === id ? { ...company, [field]: value } : company
        )
      )
    );
  };

  return (
    <>
      <div>
        <button
          disabled={loading}
          className="button"
          onClick={handleAddCompany}
        >
          Добавить компанию
        </button>
        <button
          disabled={loading}
          className="button"
          onClick={handleRemoveSelected}
        >
          Удалить выбранные
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>
                Выделить все
                <input
                  ref={inputRef}
                  type="checkbox"
                  checked={checkedAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Название компании</th>
              <th>Адрес</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} id={company.isSelected ? "selected" : ""}>
                <td>
                  <input
                    type="checkbox"
                    checked={company.isSelected}
                    onChange={() => handleSelect(company.id)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={company.name}
                    placeholder="Название"
                    onChange={(e) =>
                      handleEdit(company.id, "name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={company.address}
                    placeholder="Адрес"
                    onChange={(e) =>
                      handleEdit(company.id, "address", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <span>Загрузка...</span>}
      </div>
      <div ref={endlessScrollref} className="endlessscroll"></div>
    </>
  );
};

export default CompanyTable;
