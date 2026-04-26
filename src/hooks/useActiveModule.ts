import { useModuleStore, ModuleType } from '@/store/moduleStore';

export function useActiveModule() {
  const { activeModule, setActiveModule, getModuleConfig } = useModuleStore();
  const config = getModuleConfig();

  return {
    activeModule,
    setActiveModule,
    config: config!,
    isModule: (module: ModuleType) => activeModule === module,
  };
}
