package com.trib.platform.liquidacion.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {

    @GetMapping("/kpis")
    public ResponseEntity<Map<String, Object>> getKPIs() {
        Map<String, Object> kpis = new HashMap<>();

        // KPIs globales
        kpis.put("totalRecaudo", new BigDecimal("486200000000"));
        kpis.put("totalFacturado", new BigDecimal("612800000000"));
        kpis.put("carteraActiva", new BigDecimal("126600000000"));
        kpis.put("contribuyentes", 45678);
        kpis.put("efectividad", 79.3);
        kpis.put("variacionAnual", 18.4);

        return ResponseEntity.ok(kpis);
    }

    @GetMapping("/fuentes-recaudo")
    public ResponseEntity<List<Map<String, Object>>> getFuentesRecaudo() {
        List<Map<String, Object>> fuentes = new ArrayList<>();

        // Predial Unificado
        Map<String, Object> predial = new HashMap<>();
        predial.put("id", 1);
        predial.put("nombre", "Predial Unificado");
        predial.put("icono", "home");
        predial.put("color", "#667eea");
        predial.put("objetos", 15234);
        predial.put("facturado", new BigDecimal("156000000000"));
        predial.put("recaudado", new BigDecimal("128500000000"));
        predial.put("efectividad", 82.4);
        fuentes.add(predial);

        // ICA Industrial
        Map<String, Object> icaInd = new HashMap<>();
        icaInd.put("id", 2);
        icaInd.put("nombre", "ICA Industrial");
        icaInd.put("icono", "factory");
        icaInd.put("color", "#f093fb");
        icaInd.put("objetos", 1823);
        icaInd.put("facturado", new BigDecimal("89300000000"));
        icaInd.put("recaudado", new BigDecimal("71200000000"));
        icaInd.put("efectividad", 79.7);
        fuentes.add(icaInd);

        // ICA Comercial
        Map<String, Object> icaCom = new HashMap<>();
        icaCom.put("id", 3);
        icaCom.put("nombre", "ICA Comercial");
        icaCom.put("icono", "store");
        icaCom.put("color", "#4facfe");
        icaCom.put("objetos", 8456);
        icaCom.put("facturado", new BigDecimal("124500000000"));
        icaCom.put("recaudado", new BigDecimal("102800000000"));
        icaCom.put("efectividad", 82.6);
        fuentes.add(icaCom);

        // Alumbrado Público
        Map<String, Object> alumbrado = new HashMap<>();
        alumbrado.put("id", 4);
        alumbrado.put("nombre", "Alumbrado Público");
        alumbrado.put("icono", "lightbulb");
        alumbrado.put("color", "#faaca8");
        alumbrado.put("objetos", 12567);
        alumbrado.put("facturado", new BigDecimal("145200000000"));
        alumbrado.put("recaudado", new BigDecimal("118400000000"));
        alumbrado.put("efectividad", 81.5);
        fuentes.add(alumbrado);

        // Valorización
        Map<String, Object> valorizacion = new HashMap<>();
        valorizacion.put("id", 5);
        valorizacion.put("nombre", "Valorización");
        valorizacion.put("icono", "construction");
        valorizacion.put("color", "#a8edea");
        valorizacion.put("objetos", 3456);
        valorizacion.put("facturado", new BigDecimal("67800000000"));
        valorizacion.put("recaudado", new BigDecimal("48600000000"));
        valorizacion.put("efectividad", 71.7);
        fuentes.add(valorizacion);

        // Espacio Público
        Map<String, Object> espacioPublico = new HashMap<>();
        espacioPublico.put("id", 6);
        espacioPublico.put("nombre", "Espacio Público");
        espacioPublico.put("icono", "park");
        espacioPublico.put("color", "#fed6e3");
        espacioPublico.put("objetos", 2142);
        espacioPublico.put("facturado", new BigDecimal("30000000000"));
        espacioPublico.put("recaudado", new BigDecimal("16700000000"));
        espacioPublico.put("efectividad", 55.7);
        fuentes.add(espacioPublico);

        return ResponseEntity.ok(fuentes);
    }
}
