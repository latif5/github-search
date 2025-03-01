import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonItem = () => {
  return (
    <section>
      <ul className="list">
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <li className="card" key={index}>
              <Skeleton className="h-16 w-[80%] lg:w-[80%]"/>
            </li>
          ))}
      </ul>
    </section>
  );
};

const SkeletonAccordion = () => {
  return (
    <>
      <SkeletonItem />
    </>
  );
};

export default SkeletonAccordion;
