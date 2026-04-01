import svgPaths from "./svg-52hts0uwdn";

function Heart1() {
  return (
    <div className="absolute inset-[10.03%_10%_9.97%_10%]" data-name="heart 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 800 800">
        <g clipPath="url(#clip0_358_568)" id="heart 1">
          <path d={svgPaths.p28d8700} fill="var(--fill-0, #D7443E)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_358_568">
            <rect fill="white" height="800" width="800" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default function Heart() {
  return (
    <div className="relative size-full" data-name="heart">
      <Heart1 />
    </div>
  );
}