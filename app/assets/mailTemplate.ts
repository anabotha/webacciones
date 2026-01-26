export function alertaInversionTemplate({
  semana_inicio,
  semana_fin,
  ganancia_realizada,
  capital_usado,
  rendimiento_pct,
  operaciones,
}: {
  semana_inicio: string;
  semana_fin: string;
  ganancia_realizada: number;
  capital_usado: number;
  rendimiento_pct: number;
  operaciones: number;
}) {
  return `
    <h2>Resumen Semanal de Inversiones</h2>
    <p><strong>Período:</strong> ${semana_inicio} al ${semana_fin}</p>
    <p><strong>Capital Usado:</strong> $${capital_usado.toFixed(2)}</p>
    <p><strong>Ganancia Realizada:</strong> $${ganancia_realizada.toFixed(2)}</p>
    <p><strong>Rendimiento:</strong> ${rendimiento_pct.toFixed(2)}%</p>
    <p><strong>Operaciones Realizadas:</strong> ${operaciones}</p>
  `;
}
