import { api } from "@/services/api";
import { useEffect, useState } from "react";

export default function AttendanceFlow({ dictionary }: { dictionary: any }) {
  const [stats, setStats] = useState({
    waiting: 0,
    inService: 0,
    occupancy: 0,
    finished: 0,
    goal: 0,
    avgTime: 12 // Mocked for now as we don't have easy time diff data yet
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlow = async () => {
      try {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        // Previous Month Comparison for Goal
        const prevMonthDate = new Date(now);
        prevMonthDate.setMonth(now.getMonth() - 1);
        const prevYyyy = prevMonthDate.getFullYear();
        const prevMm = String(prevMonthDate.getMonth() + 1).padStart(2, '0');
        const prevDd = String(prevMonthDate.getDate()).padStart(2, '0');
        const prevMonthStr = `${prevYyyy}-${prevMm}-${prevDd}`;

        // 1. Fetch Today's Appointments
        // 2. Fetch Last Month's Appointments (for Goal)
        // 3. Fetch Dentists (for Capacity)
        const [todayAppts, prevMonthAppts, dentists] = await Promise.all([
            api.scheduling.list(`data=${todayStr}`),
            api.scheduling.list(`data=${prevMonthStr}`),
            api.dentists.list() // To get total dentists count
        ]);

        console.log("DEBUG: Today's Appointments:", todayAppts);

        // Calculate Today's Stats
        let waitingCount = 0;
        let inServiceCount = 0;
        let finishedCount = 0;
        let totalWaitMinutes = 0;

        if (Array.isArray(todayAppts)) {
            todayAppts.forEach((appt: any) => {
                // Ensure we only count today's appointments matches the date
                const apptDateStr = appt.dataHoraInicio || appt.data || '';
                
                if (apptDateStr.startsWith(todayStr)) {
                    const s = appt.status?.toUpperCase();
                    
                    if (['AGUARDANDO', 'CONFIRMADO', 'AGENDADO'].includes(s)) {
                        waitingCount++;
                        
                        // Calculate Wait Time (Now - Scheduled Time)
                        // If status is specifically 'AGUARDANDO' (Waiting in lobby), we calculate delay
                        if (s === 'AGUARDANDO' || s === 'CONFIRMADO') {
                             const scheduledTime = new Date(appt.dataHoraInicio || appt.data);
                             const diffMs = now.getTime() - scheduledTime.getTime();
                             const diffMins = Math.floor(diffMs / 60000);
                             
                             // Only count positive delays (late)
                             if (diffMins > 0) {
                                 totalWaitMinutes += diffMins;
                             }
                        }
                    }
                    
                    if (['EM_ATENDIMENTO', 'EM ATENDIMENTO', 'ATENDENDO'].includes(s)) inServiceCount++;
                    
                    if (['FINALIZADO', 'CONCLUIDO', 'ATENDIDO'].includes(s)) finishedCount++;
                }
            });
        }

        // Calculate Average Wait Time
        // We only average across patients who are actually waiting (and potentially late)
        const avgTimeVal = waitingCount > 0 ? Math.round(totalWaitMinutes / waitingCount) : 0;

        // Calculate Goal (Comparison with same day last month)
        let finishedLastMonth = 0;
        if (Array.isArray(prevMonthAppts)) {
            prevMonthAppts.forEach((appt: any) => {
                 const apptDate = appt.dataHoraInicio || appt.data || '';
                 if (apptDate.startsWith(prevMonthStr)) {
                    const s = appt.status?.toUpperCase();
                    if (['FINALIZADO', 'CONCLUIDO', 'ATENDIDO'].includes(s)) finishedLastMonth++;
                 }
            });
        }

        // Goal Percentage: (Today / LastMonth) * 100
        // Use 1 as denominator if 0 to avoid Infinity, or just 100% if both 0
        let goalPct = 0;
        if (finishedLastMonth > 0) {
            goalPct = Math.round((finishedCount / finishedLastMonth) * 100);
        } else if (finishedCount > 0) {
            goalPct = 100; // Found 100% growth if prev was 0
        }

        // Occupancy: In Service / Total Dentists
        const totalDentists = Array.isArray(dentists) ? dentists.length : 1;
        const occupancyPct = Math.round((inServiceCount / (totalDentists || 1)) * 100);

        setStats({
            waiting: waitingCount,
            inService: inServiceCount,
            occupancy: occupancyPct,
            finished: finishedCount,
            goal: goalPct,
            avgTime: avgTimeVal
        });

      } catch (error) {
        console.error("Failed to fetch attendance stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlow();
  }, []);

  if (loading) {
      return (
        <section className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>)}
            </div>
        </section>
      );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
          <span className="material-symbols-outlined text-blue-400">stream</span> {dictionary?.dashboard?.attendance?.title || "Fluxo de Atendimento Agora"}
        </h3>
        <span className="flex items-center gap-1.5 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-xs font-bold text-green-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          {dictionary?.dashboard?.attendance?.realtime || "Tempo Real"}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Waiting */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-500"></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{dictionary?.dashboard?.attendance?.waitingRoom || "Sala de Espera"}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h4 className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.waiting}</h4>
              <span className="text-xs text-gray-400 font-medium">{dictionary?.dashboard?.attendance?.patients || "pacientes"}</span>
            </div>
            <p className="text-[10px] text-yellow-500 font-bold mt-1">{dictionary?.dashboard?.attendance?.avgTime || "Tempo médio"}: {stats.avgTime} min</p>
          </div>
          <div className="size-12 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">chair</span>
          </div>
        </div>

        {/* In Service */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-400"></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{dictionary?.dashboard?.attendance?.inService || "Em Atendimento"}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h4 className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.inService}</h4>
              <span className="text-xs text-gray-400 font-medium">{dictionary?.dashboard?.attendance?.dentistsBusy || "dentistas ocupados"}</span>
            </div>
            <p className="text-[10px] text-blue-400 font-bold mt-1">{dictionary?.dashboard?.attendance?.occupancy || "Ocupação"}: {stats.occupancy}%</p>
          </div>
          <div className="size-12 bg-blue-400/10 rounded-full flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">dentistry</span>
          </div>
        </div>

        {/* Finished */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-600"></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{dictionary?.dashboard?.attendance?.finishedToday || "Finalizados Hoje"}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h4 className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.finished}</h4>
              <span className="text-xs text-gray-400 font-medium">{dictionary?.dashboard?.attendance?.consultations || "consultas"}</span>
            </div>
            <p className="text-[10px] text-green-600 font-bold mt-1">{dictionary?.dashboard?.attendance?.goal || "Meta"}: {stats.goal}%</p>
          </div>
          <div className="size-12 bg-green-600/10 rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
        </div>
      </div>
    </section>
  );
}
