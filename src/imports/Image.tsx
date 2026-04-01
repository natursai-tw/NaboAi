import svgPaths from "./svg-ranyo598an";

function Group1() {
  return (
    <div className="absolute inset-[4.14%_0]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 809.996 743.005">
        <g id="Group">
          <path d={svgPaths.p1545ccc0} fill="var(--fill-0, #3A648C)" id="Vector" />
          <path d={svgPaths.p3d9c6c80} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p235c0940} fill="var(--fill-0, #F3CC58)" id="Vector_3" />
          <path d={svgPaths.p3dc32e80} fill="var(--fill-0, white)" id="Vector_4" />
          <path d={svgPaths.p333d500} fill="var(--fill-0, #F3CC58)" id="Vector_5" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[4.14%_0]" data-name="Group">
      <Group1 />
    </div>
  );
}

function EducationalHandDrawToyWithShapes() {
  return (
    <div className="absolute bottom-[63px] overflow-clip right-[95px] size-[810px]" data-name="educational-hand-draw-toy-with-shapes 1">
      <Group />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute bottom-[63px] contents right-[95px]">
      <EducationalHandDrawToyWithShapes />
    </div>
  );
}

export default function Image() {
  return (
    <div className="overflow-clip relative rounded-[100px] size-full" data-name="image">
      <Group2 />
    </div>
  );
}