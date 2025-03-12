import micropip

async def install_packages():
    try:

        base_url = "emfs:///mnt/py/wheels/"

        def get_package_url(package_name):
            return f"{base_url}{package_name}"

        pyodide_wheels = [
            get_package_url("pyodide_wheels/packaging-23.2-py3-none-any.whl"),
            get_package_url("pyodide_wheels/six-1.16.0-py2.py3-none-any.whl"),
            get_package_url("pyodide_wheels/python_sat-1.8.dev13-cp312-cp312-pyodide_2024_0_wasm32.whl"),
        ]

        flamapy_wheels = [
            get_package_url("flamapy_wheels/ply-3.10-py2.py3-none-any.whl"),
            get_package_url("flamapy_wheels/astutils-0.0.6-py3-none-any.whl"),
            get_package_url("flamapy_wheels/dd-0.5.7-py3-none-any.whl"),
            get_package_url("flamapy_wheels/flamapy_sat-2.0.1-py3-none-any.whl"),
            get_package_url("flamapy_wheels/flamapy-2.0.1-py3-none-any.whl"),
            get_package_url("flamapy_wheels/flamapy_bdd-2.0.1-py3-none-any.whl"),
            get_package_url("flamapy_wheels/flamapy_fm-2.0.1-py3-none-any.whl"),
            get_package_url("flamapy_wheels/flamapy_fw-2.0.1-py3-none-any.whl"),
            get_package_url("flamapy_wheels/afmparser-1.0.3-py3-none-any.whl"),
            get_package_url("flamapy_wheels/antlr4_python3_runtime-4.13.1-py3-none-any.whl"),
            get_package_url("flamapy_wheels/graphviz-0.20-py3-none-any.whl"),
            get_package_url("flamapy_wheels/uvlparser-2.0.1-py3-none-any.whl")
        ]

        await micropip.install(pyodide_wheels, keep_going=True)
        await micropip.install(flamapy_wheels, deps=False)

    except Exception as e:
        print(f"❌ Package installation error: {e}")
