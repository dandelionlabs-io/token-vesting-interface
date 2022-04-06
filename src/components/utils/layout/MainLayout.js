import React from "react";
import "./MainLayout.scss";

const MainLayout = ({ children, className, id }) => {
  return (
    <section id={id}>
      <div className={`main-container row ${className}`}>{children}</div>
    </section>
  );
};

export default MainLayout;
