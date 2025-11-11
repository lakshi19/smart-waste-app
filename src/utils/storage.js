export const saveReports = (reports) => {
  localStorage.setItem("wasteReports", JSON.stringify(reports));
};

export const getReports = () => {
  const data = localStorage.getItem("wasteReports");
  return data ? JSON.parse(data) : [];
};
