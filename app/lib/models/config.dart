class Config {
  String id;
  String name;
  String fqdn;
  String? apiKey;

  Config({
    required this.id,
    required this.name,
    required this.fqdn,
    this.apiKey,
  });

  Config.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        apiKey = json['apiKey'],
        fqdn = json['fqdn'],
        name = json['name'];

  Map<String, dynamic> toJson() =>
      {'id': id, 'name': name, 'fqdn': fqdn, 'apiKey': apiKey};
}
