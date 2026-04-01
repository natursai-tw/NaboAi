import svgPaths from "./svg-ba4v7rgjk2";

function Eye1() {
  return (
    <div className="absolute inset-[10.03%_10%_9.97%_10%]" data-name="eye 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 800 800">
        <g id="eye 1">
          <path d={svgPaths.pb0be100} fill="var(--fill-0, #3A648C)" id="Vector" />
          <path d={svgPaths.p3fb95000} fill="var(--fill-0, #3A648C)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

export default function Eye() {
  return (
    <div className="relative size-full" data-name="eye">
      <Eye1 />
    </div>
  );
}