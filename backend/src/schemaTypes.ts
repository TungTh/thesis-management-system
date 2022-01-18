/**
        '/*******************************',
        ' *                             *',
        ' *          TYPE DEFS          *',
        ' *                             *',
        ' *******************************'
    */
/**
 * **defaultDef**
 */
export interface GQLQuery {
  default?: string;
}

export interface GQLMutation {
  createNamespace?: GQLNamespace;
  createDeployment?: GQLDeployment;
  createStatefulSet?: GQLStatefulSet;
  createService?: GQLService;
  createConfigMap?: GQLConfigMap;
  createSecret?: GQLSecret;
}

export interface GQLNamespace {
  name: string;
  deployments?: Array<GQLDeployment>;
  statefulSets?: Array<GQLStatefulSet>;
  pods?: Array<GQLPod>;
  configMaps?: Array<GQLConfigMap>;
  secrets?: Array<GQLSecret>;
  services?: Array<GQLService>;
}

export interface GQLDeployment {
  meta: GQLMetadata;
  replicas: number;
  template: GQLPodTemplate;
  yaml: string;
}

export interface GQLMetadata {
  name: string;
  uid: string;
  namespace: GQLNamespace;
}

export interface GQLPodTemplate {
  meta: GQLMetadata;
  containers: Array<GQLContainer>;
}

export interface GQLContainer {
  name: string;
  image: string;
  resources?: GQLResourceRequirements;
  ports?: Array<GQLContainerPort>;
  env?: Array<GQLEnvVar>;
}

export interface GQLResourceRequirements {
  limits?: GQLResource;
  requests?: GQLResource;
}

export interface GQLResource {
  cpu?: string;
  memory?: string;
}

export interface GQLContainerPort {
  containerPort: number;
  name?: string;
  protocol?: GQLPortProtocol;
}

export enum GQLPortProtocol {
  UDP = 'UDP',
  TCP = 'TCP',
  SCTP = 'SCTP'
}

export interface GQLEnvVar {
  name: string;
  value?: string;
  valueFrom?: GQLEnvVarSrc;
}

export interface GQLEnvVarSrc {
  configMapKeyRef?: GQLKeyRef;
  secretKeyRef?: GQLKeyRef;
}

export interface GQLKeyRef {
  name: string;
  key: string;
}

export interface GQLStatefulSet {
  meta: GQLMetadata;
  replicas: number;
  serviceName: string;
  template: GQLPodTemplate;
  yaml: string;
}

export interface GQLPod {
  meta: GQLMetadata;
  hostIP: string;
  podIP: string;
  status: string;
}

export interface GQLConfigMap {
  meta: GQLMetadata;
  data?: Array<GQLMapValue>;
  yaml: string;
}

export interface GQLMapValue {
  key: string;
  value: string;
}

export interface GQLSecret {
  meta: GQLMetadata;
  type: string;
  data?: Array<GQLMapValue>;
  yaml: string;
}

export interface GQLService {
  meta: GQLMetadata;
  dplName: string;
  type: GQLServiceType;
  ports?: Array<GQLServicePort>;
  yaml: string;
}

export enum GQLServiceType {
  ExternalName = 'ExternalName',
  ClusterIP = 'ClusterIP',
  NodePort = 'NodePort',
  LoadBalancer = 'LoadBalancer'
}

export interface GQLServicePort {
  name?: string;
  protocol: GQLPortProtocol;
  port: number;
  targetPort?: string;
  nodePort?: number;
}

export interface GQLDeploymentInput {
  name: string;
  replicas: number;
  template: GQLPodTemplateInput;
}

export interface GQLPodTemplateInput {
  meta: GQLMetadataInput;
  containers: Array<GQLContainerInput>;
}

export interface GQLMetadataInput {
  name: string;
  uid?: string;
  namespace?: string;
}

export interface GQLContainerInput {
  name: string;
  image: string;
  resources?: GQLResourceRequirementsInput;
  ports?: Array<GQLContainerPortInput>;
  env?: Array<GQLEnvVarInput>;
}

export interface GQLResourceRequirementsInput {
  limits?: GQLResourceInput;
  requests?: GQLResourceInput;
}

export interface GQLResourceInput {
  cpu?: string;
  memory?: string;
}

export interface GQLContainerPortInput {
  containerPort: number;
  name?: string;
  protocol?: GQLPortProtocol;
}

export interface GQLEnvVarInput {
  name: string;
  value?: string;
  valueFrom?: GQLEnvVarSrcInput;
}

export interface GQLEnvVarSrcInput {
  configMapKeyRef?: GQLKeyRefInput;
  secretKeyRef?: GQLKeyRefInput;
}

export interface GQLKeyRefInput {
  name: string;
  key: string;
}

export interface GQLStatefulSetInput {
  name: string;
  replicas: number;
  serviceName: string;
  template: GQLPodTemplateInput;
}

export interface GQLServiceInput {
  name: string;
  dplName: string;
  type: GQLServiceType;
  ports?: Array<GQLServicePortInput>;
}

export interface GQLServicePortInput {
  name?: string;
  protocol: GQLPortProtocol;
  port: number;
  targetPort?: string;
  nodePort?: number;
}

export interface GQLConfigMapInput {
  name: string;
  data?: Array<GQLMapValueInput>;
}

export interface GQLMapValueInput {
  key: string;
  value: string;
}

export interface GQLSecretInput {
  name: string;
  type: string;
  data?: Array<GQLMapValueInput>;
}

export interface GQLPersistentVolume {
  meta: GQLMetadata;
  accessMode: Array<GQLVolumeAccessMode>;
  volumeMode: string;
  capacity: string;
  reclaimPolicy: GQLPersistentVolumeReclaimPolicy;
}

export enum GQLVolumeAccessMode {
  ReadWriteOnce = 'ReadWriteOnce',
  ReadOnlyMany = 'ReadOnlyMany',
  ReadWriteMany = 'ReadWriteMany',
  ReadWriteOncePod = 'ReadWriteOncePod'
}

export enum GQLPersistentVolumeReclaimPolicy {
  Retain = 'Retain',
  Delete = 'Delete'
}

export interface GQLPersistentVolumeClaim {
  meta: GQLMetadata;
  volumeName: string;
  volumeMode: string;
  accessMode: Array<GQLVolumeAccessMode>;
  resources?: GQLResourceRequirements;
}

export interface GQLThesis {
  title: string;
  studentName: string;
  supervisorName: string;
  summary?: string;
  report?: string;
  namespace: GQLNamespace;
  user: GQLUser;
  tags?: Array<GQLThesisTag>;
}

export interface GQLUser {
  name: string;
  username: string;
  thesis?: Array<GQLThesis>;
  role: GQLRole;
}

export interface GQLRole {
  id: string;
  name: string;
  users?: Array<GQLUser>;
}

export interface GQLThesisTag {
  name: string;
  thesis?: Array<GQLThesis>;
}

