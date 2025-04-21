export default function NotFound() {
  return (
    <div className="h-screen-navbar container flex flex-col gap-4 items-center justify-center">
      <h1 className="font-bold text-9xl text-accent">404</h1>
      <div className="font-semibold text-4xl flex flex-row">
        <h1 className="text-[#FDDA01]">ОЙ,</h1>
        <h1 className="text-foreground">что-то пошло не так</h1>
      </div>
      <p className="text-muted-foreground">К сожалению, страница, которую вы ищете, не существует или была удалена.</p>
    </div>
  );
}
