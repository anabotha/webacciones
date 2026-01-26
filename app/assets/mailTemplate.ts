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
  <div style="
  max-width: 520px;
  margin: 20px auto;
  padding: 20px 24px;
  border-radius: 12px;
  background: #f9fafb;
  font-family: Arial, Helvetica, sans-serif;
  color: #1f2937;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
">
  <h2 style="
    margin: 0 0 12px 0;
    font-size: 20px;
    font-weight: 700;
    color: #111827;
  ">
    Resumen Semanal de Inversiones
  </h2>

  <p style="
    margin: 0 0 16px 0;
    font-size: 13px;
    color: #6b7280;
  ">
    Período: <strong>${semana_inicio}</strong> al <strong>${semana_fin}</strong>
  </p>

  <div style="display: grid; row-gap: 10px;">
    <div style="display: flex; justify-content: space-between;">
      <span>Capital utilizado: </span>
      <strong>$${capital_usado.toFixed(2)}</strong>
    </div><br>

    <div style="display: flex; justify-content: space-between;">
      <span>Ganancia realizada: </span>
      <strong style="color: ${ganancia_realizada >= 0 ? '#059669' : '#dc2626'};">
        $${ganancia_realizada.toFixed(2)}
      </strong>
    </div>
<br>
    <div style="display: flex; justify-content: space-between;">
      <span>Rendimiento: </span>
      <strong style="color: ${rendimiento_pct >= 0 ? '#059669' : '#dc2626'};">
        ${rendimiento_pct.toFixed(2)}%
      </strong>
    </div>
<br>
    <div style="display: flex; justify-content: space-between;">
      <span>Operaciones realizadas: </span>
      <strong>${operaciones}</strong>
    </div>
  </div>
</div>

  `;
}
