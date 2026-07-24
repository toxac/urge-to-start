// complete project type definition
type Project = {
    biz_name: string | null;
    build_data: Json;
    competitive_landscape: Json;
    compliance_checklist: Json;
    created_at: string;
    current_mission: string;
    discovery_metrics: Json;
    financial_blueprint: Json;
    five_word_hook: string | null;
    id: string;
    infrastructure_nodes: Json;
    is_active: boolean;
    launch_data: Json;
    operations_data: Json;
    review_data: Json;
    solution_design: Json;
    status: string;
    tagline: string | null;
    updated_at: string;
    user_id: string;
    validation_data: Json; // customer avatar comes here should be separate field
    viability_check: Json;
}

type ProjectCreationFormSchema = {
    biz_name: string;
    five_word_hook: string;
    tagline: string;
}


