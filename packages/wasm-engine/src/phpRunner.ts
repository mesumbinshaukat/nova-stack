import fs from 'fs';
import path from 'path';

// Load and compile the PHP WASM module
const wasmPath = path.resolve(__dirname, '../../dist/php.wasm');
const wasmBuffer = fs.readFileSync(wasmPath);
const phpModule = await WebAssembly.compile(wasmBuffer);
const phpInstance = await WebAssembly.instantiate(phpModule, {
  env: {
    // Provide any required imports (e.g., memory, table) if needed by the PHP compile
    memory: new WebAssembly.Memory({ initial: 256 }),
    table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
    // You can stub out syscalls as no-ops for now
    __sys_chdir: () => 0,
    __sys_stat64: () => 0,
    __sys_writev: () => 0,
    __sys_fstat64: () => 0,
    __sys_getcwd: () => 0,
    __sys_brk: () => 0,
    __sys_readlink: () => 0,
    __sys_fchmod: () => 0,
    __sys_lstat64: () => 0,
    __sys_mmap2: () => 0,
    __sys_open: () => 0,
    __sys_close: () => 0,
    __sys_read: () => 0,
    __sys_munmap: () => 0,
    __sys_statfs: () => 0,
    __sys_unlink: () => 0,
    __sys_sigaction: () => 0,
    __sys_access: () => 0,
    __sys_wait4: () => 0,
  },
});

export default phpInstance; 