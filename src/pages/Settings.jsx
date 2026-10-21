import { Server, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getAdminProfile,
  getSystemInformation,
} from "../api/settingsApi";

function Settings() {
  const [admin, setAdmin] = useState(null);
  const [system, setSystem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadSettings() {
      try {
        const [profileResponse, systemResponse] = await Promise.all([
          getAdminProfile(),
          getSystemInformation(),
        ]);

        if (isCurrent) {
          setAdmin(profileResponse?.admin ?? null);
          setSystem(systemResponse?.system ?? null);
        }
      } catch (requestError) {
        if (isCurrent && requestError.response?.status !== 401) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load settings.",
          );
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">Settings</h3>
            <p className="mt-1 text-sm text-slate-600">
              View admin profile and system information.
            </p>
          </div>
          <SettingsIcon className="text-violet-600" size={24} />
        </div>
      </section> */}

      {loading ? (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Loading settings...</p>
        </section>
      ) : error ? (
        <section className="rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <UserRound className="text-violet-600" size={22} />
              <h3 className="text-lg font-semibold text-slate-950">
                Admin Profile
              </h3>
            </div>

            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Name</dt>
                <dd className="font-medium text-slate-900">
                  {admin?.name ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Email</dt>
                <dd className="font-medium text-slate-900">
                  {admin?.email ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Role</dt>
                <dd className="font-medium text-slate-900">
                  {admin?.role ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Status</dt>
                <dd className="font-medium text-slate-900">
                  {admin?.status ?? "—"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Server className="text-violet-600" size={22} />
              <h3 className="text-lg font-semibold text-slate-950">
                System Information
              </h3>
            </div>

            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Application</dt>
                <dd className="font-medium text-slate-900">
                  {system?.application ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Backend</dt>
                <dd className="font-medium text-slate-900">
                  {system?.backend ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Database</dt>
                <dd className="font-medium text-slate-900">
                  {system?.database ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Storage</dt>
                <dd className="font-medium text-slate-900">
                  {system?.storage ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Version</dt>
                <dd className="font-medium text-slate-900">
                  {system?.version ?? "—"}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      )}
    </div>
  );
}

export default Settings;
