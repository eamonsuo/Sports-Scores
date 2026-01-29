export default function Header() {
  return (
    <header className="flex h-16 w-full justify-between bg-gray-200 dark:bg-neutral-900">
      {/* <button className="ps-2" onClick={() => router.back()}>
        <SVGBackArrow className="fill-neutral-600 active:fill-neutral-400" /> */}
      {/* <Image
          className="active:border active:border-green-500"
          src={backArrow}
          width={30}
          height={30}
          alt="back arrow"
        ></Image> */}
      {/* </button> */}
      {/* <button className="pe-2" onClick={() => useRevalidatePathAction(path)}>
        <Image
          src={"/refresh-svgrepo-com.svg"}
          width={40}
          height={40}
          alt="menu"
          className="active:border active:border-green-500"
        ></Image>
        <SVGRefresh className="fill-neutral-600 active:fill-neutral-400" />
      </button> */}
    </header>
  );
}
